import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Not, Repository } from "typeorm";
import { IeltsTestDto, UpdateIeltsTestDto } from "./request/ielts-test.dto";
import { IeltsTest, IeltsWritingPartDetail, QuestionKey, TestResult, User, UserAnswer } from "../../database/entities";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { calculateBandScores, getArrayPaginationBuildTotal, getOffset, roundToHalf } from "../../shared/Utils";
import { UserAnswersDto } from "./request/user-answers.dto";
import { IeltsTestPart } from "../../database/entities/IeltsTestPart.entity";
import { SubmitIeltsWritingAnswersDto } from "./request/submitIeltsWritingAnswers.dto";
import { FREQUENCY, TETS_RESULT_STATUS } from "../../shared/constant";
import { EvaluateWritingPartAnswerDto } from "./request/evaluateWritingTestAnswer.dto";
import { SubmitIeltsSpeakingAnswerDto } from "./request/submitIeltsSpeakingAnswer.dto";
import { SubmitIeltsListeningAndReadingAnswers } from "./request/submitIeltsListeningAndReadingAnswers.dto";
import { CreateTestResultDto } from "./request/createTestResult.dto";
import { EvaluateSpeakingTestAnswerDto } from "./request/evaluateSpeakingTestAnswer.dto";

@Injectable()
export class IeltsTestService {
    constructor(
        @InjectRepository(IeltsTest)
        private ieltsTestRepo: Repository<IeltsTest>,
        @InjectDataSource()
        private dataSource: DataSource
    ) {

    }

    async createIeltsTest(data: IeltsTestDto) {
        const checkNameExist = await this.ieltsTestRepo.findOne({
            where: {
                name: data.name
            }
        })

        if (checkNameExist) throw new BadRequestException("This name already exist")

        const ieltsTest = new IeltsTest()
        ieltsTest.name = data.name
        ieltsTest.type = data.type

        const createdIeltsTest = await this.ieltsTestRepo.save(ieltsTest)
        return createdIeltsTest
    }

    async getIeltsTestById(id: number) {
        const ieltsTest = await this.ieltsTestRepo.findOne({
            where: {
                id
            }
        })

        if (!ieltsTest) throw new BadRequestException("Id is not exist")
        return ieltsTest
    }

    async getList(filter, paginationOptions: IPaginationOptions) {
        let offset = getOffset(paginationOptions)
        let limit = Number(paginationOptions.limit)
        let queryBuilder = this.dataSource
                        .createQueryBuilder(IeltsTest, 'ielts_test')
                        .select("*")
                        .orderBy("createdAt", "DESC")
                        .limit(limit)
                        .offset(offset)

        let queryCount = this.dataSource
                        .createQueryBuilder(IeltsTest, 'ielts_test')
                        .select("Count (1) as Total")

        if (filter.name) {
            queryBuilder.andWhere(`name like '%${filter.name.trim()}%'`)
            queryCount.andWhere(`name like '%${filter.name.trim()}%'`)
        }

        if (filter.type) {
            queryBuilder.andWhere(`type like '%${filter.type.trim()}%'`)
            queryCount.andWhere(`type like '%${filter.type.trim()}%'`)
        }
        
        const tests = await queryBuilder.execute()
        const testCountList = await queryCount.execute()

        const {items, meta} = getArrayPaginationBuildTotal<IeltsTest>(tests, testCountList, paginationOptions)

        return {
            results: items,
            pagination: meta
        }
    }

    async update(data: UpdateIeltsTestDto) {
        const test = await this.ieltsTestRepo.findOne({
            where: {
                id: data.id
            }
        })
        if (!test) throw new BadRequestException("Id is not exist")

        const checkNameExist = await this.ieltsTestRepo.findOne({
            where: {
                name: data.name,
                id: Not(data.id)
            }
        })
        if (checkNameExist) throw new BadRequestException("This name already exist")

        test.name = data.name
        return this.ieltsTestRepo.save(test)
    }

    async delete(id) {
        const test = await this.ieltsTestRepo.findOne({
            where: {
                id
            }
        })
        if (!test) throw new BadRequestException("Id is not exist")
        
        return await this.ieltsTestRepo.delete(id)
    }

    async getScore(data: UserAnswersDto) {
        const questionKeys = await this.dataSource.getRepository(QuestionKey).findBy({
            testId: data.testId
        })

        let score = 0
        data.userAnswers.forEach(userAnswer => {
            const questionKey = questionKeys.find(questionKey => questionKey.id === userAnswer.questionId)
            if (questionKey && questionKey.key.toUpperCase() === userAnswer.answer.trim().toUpperCase()) {
                score++
            }
        })
        return {
            score,
            total: questionKeys.length
        }
    }

    async submitIeltsListeningAndReadingAnswers(data: SubmitIeltsListeningAndReadingAnswers, userId: number) {
        const question = await this.dataSource.getRepository(QuestionKey).findOneBy({ id: data.userAnswers[0].questionId });
        if (!question) throw new BadRequestException(`Part id ${question.partId} is not exist.`)

        const part = await this.dataSource.getRepository(IeltsTestPart).findOneBy({ id: question.partId });

        if (!part) throw new BadRequestException(`Part id ${question.partId} is not exist.`)


        const questionKeys = await this.dataSource.getRepository(QuestionKey).findBy({
            testId: question.testId,
        })

        let numberOfCorrectAnswers = 0
        const userAnswerDBs = []
        for (const userAnswer of data.userAnswers) {
            const question = await this.dataSource.getRepository(QuestionKey).findOneBy({ id: userAnswer.questionId });
            if (!question) throw new BadRequestException(`Question Id ${userAnswer.questionId} is not exist.`)

            const userAnswerDB = new UserAnswer();
            userAnswerDB.userId = userId;
            userAnswerDB.testId = question.testId;
            userAnswerDB.partId = question.partId;
            userAnswerDB.questionId = userAnswer.questionId;
            userAnswerDB.questionNumber = question.questionNumber;
            userAnswerDB.question = question.content; 
            userAnswerDB.answer = userAnswer.answer;
            userAnswerDB.key = question.key;

            const questionKey = questionKeys.find(questionKey => questionKey.id === userAnswer.questionId)
            if (questionKey && questionKey.key.toUpperCase() === userAnswer.answer.trim().toUpperCase()) {
                userAnswerDB.isCorrect = true
                numberOfCorrectAnswers++
            } 
            else {
                userAnswerDB.isCorrect = false
            }

            userAnswerDBs.push(userAnswerDB)
        }

        const testResult = new TestResult()
        testResult.userId = userId
        testResult.testId = question.testId
        testResult.bandScore = calculateBandScores(numberOfCorrectAnswers) 
        testResult.numberOfCorrectAnswers = numberOfCorrectAnswers
        testResult.totalQuestions = questionKeys.length
        await this.dataSource.getRepository(TestResult).save(testResult)

        userAnswerDBs.forEach(userAnswer => {
            userAnswer.testResultId = testResult.id
        })
        
        await this.dataSource.getRepository(UserAnswer).save(userAnswerDBs)

        return testResult
    }
    
    async submitIeltsWritingAnswers(data: SubmitIeltsWritingAnswersDto, userId: number) {
        const part = await this.dataSource.getRepository(IeltsTestPart).findOneBy({ id: data.userAnswers[0].partId });

        const testResult = new TestResult()
        testResult.userId = userId
        testResult.testId = part.testId
        await this.dataSource.getRepository(TestResult).save(testResult)

        const userAnswerDBs = []
        for (const userAnswer of data.userAnswers) {
            const part = await this.dataSource.getRepository(IeltsTestPart).findOneBy({ id: userAnswer.partId });
            const partDetail = await this.dataSource.getRepository(IeltsWritingPartDetail).findOneBy({ partId: userAnswer.partId });
            if (!part) throw new BadRequestException(`Part id ${userAnswer.partId} is not exist.`)
            if (!partDetail) throw new BadRequestException(`Part detail id ${userAnswer.partId} is not exist.`)

            const userAnswerDB = new UserAnswer();
            userAnswerDB.userId = userId;
            userAnswerDB.testId = part.testId;
            userAnswerDB.partId = userAnswer.partId;
            userAnswerDB.partNumber = part.partNumber;
            userAnswerDB.question = partDetail.content;
            userAnswerDB.answer = userAnswer.answer;
            userAnswerDB.testResultId = testResult.id
            userAnswerDBs.push(userAnswerDB)
        }
        await this.dataSource.getRepository(UserAnswer).save(userAnswerDBs)
        return testResult
    }

    async submitIeltsSpeakingAnswer(data: SubmitIeltsSpeakingAnswerDto, userId: number) {
        const question = await this.dataSource.getRepository(QuestionKey).findOneBy({ id: data.questionId });
        if (!question) throw new BadRequestException(`Question Id ${data.questionId} is not exist.`)

        const part = await this.dataSource.getRepository(IeltsTestPart).findOneBy({ id: question.partId });

        let userAnswerDB = null
        const oldUserAnswer = await this.dataSource.getRepository(UserAnswer).findOneBy({
            testResultId: data.testResultId,
            questionId: data.questionId,
            userId
        })
        if (oldUserAnswer) {
            userAnswerDB = oldUserAnswer
        } else {
            userAnswerDB = new UserAnswer();
        }

        userAnswerDB.userId = userId;
        userAnswerDB.testId = question.testId;
        userAnswerDB.partId = question.partId;
        userAnswerDB.partNumber = part.partNumber;
        userAnswerDB.questionId = data.questionId;
        userAnswerDB.questionNumber = question.questionNumber;
        userAnswerDB.question = question.content; 
        userAnswerDB.answer = data.answer;
        userAnswerDB.key = question.key;
        userAnswerDB.testResultId = data.testResultId

        await this.dataSource.getRepository(UserAnswer).save(userAnswerDB)

        return userAnswerDB
    }

    async createTestResult(data: CreateTestResultDto, userId) {
        const testResult = new TestResult()
        testResult.userId = userId
        testResult.testId = data.testId
        await this.dataSource.getRepository(TestResult).save(testResult)
        return testResult
    }

    async getTestResultById(id: number) {
        const testResult =  await this.dataSource.getRepository(TestResult).findOne({
            where: {
                id
            },
        })

        testResult['userAnswers'] = await this.dataSource.getRepository(UserAnswer).find({
            where: {
                testResultId: id
            }
        })

        return testResult
    }

    async getLatestTestResult(testId: number, userId: number) {
        const testResult =  await this.dataSource.getRepository(TestResult).findOne({
            where: {
                testId,
                userId
            },
            order: {
                createdAt: 'DESC'
            }
        })
        if (!testResult) throw new BadRequestException("Test result is not exist")

        testResult['userAnswers'] = await this.dataSource.getRepository(UserAnswer).find({
            where: {
                testResultId: testResult.id
            }
        })

        return testResult
    }

    async requestToGetEvaluatedByExaminer(testResultId: number, userId: number) {
        const testResult =  await this.dataSource.getRepository(TestResult).findOne({
            where: {
                id: testResultId
            },
        })
        if (!testResult) throw new BadRequestException("Test result is not exist")

        if (testResult.userId !== userId) throw new BadRequestException("You are not owner of this test result")
        if (testResult.status === TETS_RESULT_STATUS.PENDING_TO_EVALUATE) throw new BadRequestException("This test result is already requested to evaluate")
        if (testResult.status === TETS_RESULT_STATUS.EVALUATED) throw new BadRequestException("This test result is already evaluated")
        
        testResult.status = TETS_RESULT_STATUS.PENDING_TO_EVALUATE
        return await this.dataSource.getRepository(TestResult).save(testResult)
    }

    async evaluateWritingPartAnswer(data: EvaluateWritingPartAnswerDto, user) {
        const userAnswer = await this.dataSource.getRepository(UserAnswer).findOne({
            where: {
                testResultId: data.testResultId,
                partId: data.partId,
            }
        })
        if (!userAnswer) throw new BadRequestException("User answer is not exist")

        const testResult = await this.dataSource.getRepository(TestResult).findOne({
            where: {
                id: userAnswer.testResultId
            }
        })
        if (!testResult) throw new BadRequestException("Test result is not exist")

        userAnswer.score = data.score
        userAnswer.comment = data.comment
        userAnswer.reviewerId = user.id
        userAnswer.reviewerName = user.fullName

        await this.dataSource.getRepository(UserAnswer).save(userAnswer)

        // Update test result
        const userAnswers = await this.dataSource.getRepository(UserAnswer).find({
            where: {
                testResultId: data.testResultId
            }
        })
        const part1 = userAnswers.find(userAnswer => userAnswer.partNumber === 1)
        const part2 = userAnswers.find(userAnswer => userAnswer.partNumber === 2)

        testResult.bandScore = roundToHalf((part1?.score * 1/3 || 0) + (part2?.score || 0) * 2/3)
        
        if (part1.score != null && part2.score != null) testResult.status = TETS_RESULT_STATUS.EVALUATED

        await this.dataSource.getRepository(TestResult).save(testResult)

        return {
            userAnswer,
            testResult
        }
    }

    async evaluateSpeakingTestAnswer(data: EvaluateSpeakingTestAnswerDto, user) {
        const testResult = await this.dataSource.getRepository(TestResult).findOne({
            where: {
                id: data.testResultId
            }
        })
        if (!testResult) throw new BadRequestException("Test result is not exist")

        testResult.bandScore = data.score
        testResult.comment = data.comment
        testResult.reviewerId = user.id
        testResult.reviewerName = user.fullName
        testResult.status = TETS_RESULT_STATUS.EVALUATED

        await this.dataSource.getRepository(TestResult).save(testResult)
        return testResult
    }

    async getTestResultList(filter, paginationOptions: IPaginationOptions) {
        let offset = getOffset(paginationOptions)
        let limit = Number(paginationOptions.limit)
        let queryBuilder = this.dataSource
                        .createQueryBuilder(TestResult, 'test_result')
                        .leftJoin(IeltsTest, 'test', 'test.id = test_result.testId')
                        .leftJoin(User, 'user', 'user.id = test_result.userId')
                        .select(["*", 
                            "test_result.id as id", 
                            "test_result.createdAt as createdAt"
                        ])
                        .orderBy("test_result.createdAt", "DESC")
                        .limit(limit)
                        .offset(offset)

        let queryCount = this.dataSource
                        .createQueryBuilder(TestResult, 'test_result')
                        .leftJoin(IeltsTest, 'test', 'test.id = test_result.testId')
                        .select("Count (1) as Total")

        if (filter.type) {
            queryBuilder.andWhere(`test.type = '${filter.type}'`)
            queryCount.andWhere(`test.type = '${filter.type}'`)
        }

        if (filter.status) {
            queryBuilder.andWhere(`test_result.status = '${filter.status}'`)
            queryCount.andWhere(`test_result.status = '${filter.status}'`)
        }

        
        const tests = await queryBuilder.execute()
        const testCountList = await queryCount.execute()

        const {items, meta} = getArrayPaginationBuildTotal<TestResult>(tests, testCountList, paginationOptions)

        return {
            results: items,
            pagination: meta
        }
    }

    async getManyTestResults(params: {
        filter: {
            testId?: number,
            userId?: number
        }
    }) {
        const {filter} = params
        const testResults = await this.dataSource.getRepository(TestResult).find({
            where: {
                testId: filter.testId,
                userId: filter.userId
            },
            order:{
                createdAt: 'DESC'
            }
        })
        return testResults
    }

    async getAverageScoreByFrequency(params: {
        filter: {
            testType: String,
            userId: Number,
            startDate: Date,
            endDate: Date
        },
        frequency: String
    }) {
        const {filter, frequency} = params
        const averageScoreQuery = this.dataSource.getRepository(TestResult)
            .createQueryBuilder("test_result")
            .leftJoin(IeltsTest, 'test', 'test.id = test_result.testId')
            .select("AVG(test_result.bandScore)", "averageScore")
            .where("test.type = :testType", { testType: filter.testType })
            .andWhere("test_result.userId = :userId", { userId: filter.userId })
    
            // .orderBy("test_result.createdAt", "ASC")

        if (filter.startDate) {
            averageScoreQuery.andWhere("test_result.createdAt >= :startDate", { startDate: filter.startDate })
        }

        if (filter.endDate) {
            averageScoreQuery.andWhere("test_result.createdAt <= :endDate", { endDate: filter.endDate })
        }

        if (frequency == FREQUENCY.DAILY) {
            averageScoreQuery.addSelect("date_format(test_result.createdAt, '%d/%m/%Y')", "milestone")
        } else if (frequency == FREQUENCY.MONTHLY) {
            averageScoreQuery.addSelect("date_format(test_result.createdAt, '%m/%Y')", "milestone")
        }

        averageScoreQuery.groupBy("milestone")
        averageScoreQuery.having("averageScore IS NOT NULL")   
        averageScoreQuery.orderBy("DATE(milestone)", "ASC")

        return await averageScoreQuery.execute()
    }
}