import { BadRequestException, Injectable, UseGuards } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { calculateBandScores, getArrayPaginationBuildTotal, getOffset } from "src/shared/Utils";
import { DataSource, In, Repository } from "typeorm";
import { IeltsTestPart } from "../../database/entities/IeltsTestPart.entity";
import { CreateIeltsListeningPartDto, UpdateIeltsListeningPartDto } from "./request/ielts-listening-part.dto";
import { IeltsListeningPartDetail, IeltsReadingPassage, IeltsTest, IeltsWritingPartDetail, QuestionGroup, QuestionGroupOption, QuestionKey, TestResult, UserAnswer } from "../../database/entities";
import { IELTS_TEST_TYPE } from "../../shared/constant";
import { CreateIeltsReadingPartDto, UpdateIeltsReadingPartDto } from "./request/ielts-reading-part.dto";
import { UploadService } from "../upload-aws-s3/upload.service";
import { CreateIeltsSpeakingPartDto } from "./request/ielts-speaking-part.dto";
import { CreateIeltsWritingPartDto, UpdateIeltsWritingPartDto } from "./request/ielts-writing-part.dto";

@Injectable()
export class IeltsTestPartService{
    constructor(
        @InjectDataSource()
        private dataSource: DataSource,

        private readonly uploadService: UploadService,
    ){
        
    }
    
    async getIeltsTestPartList(testId: number){
        const ieltsTest = await this.dataSource.getRepository(IeltsTest).findOneBy({ id: testId });
        if (!ieltsTest) throw new BadRequestException(`Test id ${testId} is not exist.`)

        const ieltsTestParts = await this.dataSource.getRepository(IeltsTestPart).find({
            where: {
                testId,
            },
            order: {
                partNumber: 'ASC'
            }
        })

        for (const ieltsTestPart of ieltsTestParts) {
            let partDetail = null
            if (ieltsTest.type === IELTS_TEST_TYPE.LISTENING) {
                partDetail = await this.dataSource.getRepository(IeltsListeningPartDetail).findOneBy({ partId: ieltsTestPart.id })
            }
            else if (ieltsTest.type === IELTS_TEST_TYPE.READING) {
                partDetail = await this.dataSource.getRepository(IeltsReadingPassage).findOneBy({ partId: ieltsTestPart.id })
            }
            ieltsTestPart['partDetail'] = partDetail


            const questionGroups = await this.dataSource.getRepository(QuestionGroup).find({
                where: {
                    partId: ieltsTestPart.id
                },
                order: {
                    from: 'ASC'
                }
            })
            ieltsTestPart['questionGroups'] = questionGroups

            for (const questionGroup of questionGroups) {
                const questionGroupOptions = await this.dataSource.getRepository(QuestionGroupOption).find({
                    where: {
                        questionGroupId: questionGroup.id
                    },
                })
                questionGroup['options'] = questionGroupOptions

                const questionKeys = await this.dataSource.getRepository(QuestionKey).findBy({ questionGroupId: questionGroup.id })
                questionGroup['keys'] = questionKeys
            }

            const questionKeys = await this.dataSource.getRepository(QuestionKey).find({
                where: {
                    questionGroupId: In(questionGroups.map(questionGroup => questionGroup.id))
                },
                order: {
                    questionNumber: 'ASC'
                }
            })

            // for (const questionKey of questionKeys) {
            //     delete questionKey.key
            // }

            ieltsTestPart['questionKeys'] = questionKeys
        }   

        return ieltsTestParts
    }

    async getIeltsSpeakingPartList(testId) {
        const ieltsTest = await this.dataSource.getRepository(IeltsTest).findOneBy({ id: testId });
        if (!ieltsTest) throw new BadRequestException(`Test id ${testId} is not exist.`)

        const ieltsTestParts = await this.dataSource.getRepository(IeltsTestPart).find({
            where: {
                testId,
            },
            order: {
                partNumber: 'ASC'
            }
        })

        for (const ieltsTestPart of ieltsTestParts) {
            const questionKeys = await this.dataSource.getRepository(QuestionKey).find({
                where: {
                    partId: ieltsTestPart.id
                },
                order: {
                    questionNumber: 'ASC'
                }
            })

            ieltsTestPart['questions'] = questionKeys
        }   

        return ieltsTestParts
    }

    async getIeltsWritingPartList(testId) {
        const ieltsTest = await this.dataSource.getRepository(IeltsTest).findOneBy({ id: testId });
        if (!ieltsTest) throw new BadRequestException(`Test id ${testId} is not exist.`)

        const ieltsTestParts = await this.dataSource.getRepository(IeltsTestPart).find({
            where: {
                testId,
            },
            order: {
                partNumber: 'ASC'
            }
        })

        for (const ieltsTestPart of ieltsTestParts) {
            const ieltsWritingPartDetail = await this.dataSource.getRepository(IeltsWritingPartDetail).findOneBy({ partId: ieltsTestPart.id })
            ieltsTestPart['partDetail'] = ieltsWritingPartDetail
        }   

        return ieltsTestParts
    }

    async createIeltsListeningPart(data: CreateIeltsListeningPartDto){
        const partNumberExist = await this.dataSource.getRepository(IeltsTestPart).findOne({
            where: {
                testId: data.testId,
                partNumber: data.partNumber
            }
        })
        if(partNumberExist) throw new BadRequestException('Part number is already exist.')

        const ieltsListeningPart = new IeltsTestPart()
        ieltsListeningPart.testId = data.testId
        ieltsListeningPart.partNumber = data.partNumber
        await this.dataSource.getRepository(IeltsTestPart).save(ieltsListeningPart)

        const ieltsListeningPartDetail = new IeltsListeningPartDetail()
        ieltsListeningPartDetail.partId = ieltsListeningPart.id
        ieltsListeningPartDetail.audioSrc = data.audioSrc
        
        return await this.dataSource.getRepository(IeltsListeningPartDetail).save(ieltsListeningPartDetail)
    }

    async createIeltsReadingPart(data: CreateIeltsReadingPartDto) {
        const partNumberExist = await this.dataSource.getRepository(IeltsTestPart).findOne({
            where: {
                testId: data.testId,
                partNumber: data.partNumber
            }
        })
        if(partNumberExist) throw new BadRequestException('Part number is already exist.')

        const ieltsTestPart = new IeltsTestPart()
        ieltsTestPart.testId = data.testId
        ieltsTestPart.partNumber = data.partNumber
        await this.dataSource.getRepository(IeltsTestPart).save(ieltsTestPart)

        const ieltsTestPartDetail = new IeltsReadingPassage()
        ieltsTestPartDetail.partId = ieltsTestPart.id
        ieltsTestPartDetail.title = data.title
        ieltsTestPartDetail.paragraphs = data.paragraphs
        
        return await this.dataSource.getRepository(IeltsReadingPassage).save(ieltsTestPartDetail)
    }

    async createIeltsSpeakingPart(data: CreateIeltsSpeakingPartDto) {
        const partNumberExist = await this.dataSource.getRepository(IeltsTestPart).findOne({
            where: {
                testId: data.testId,
                partNumber: data.partNumber
            }
        })
        if(partNumberExist) throw new BadRequestException('Part number is already exist.')

        const ieltsTestPart = new IeltsTestPart()
        ieltsTestPart.testId = data.testId
        ieltsTestPart.partNumber = data.partNumber
        return await this.dataSource.getRepository(IeltsTestPart).save(ieltsTestPart)
    }

    async createIeltsWritingPart(data: CreateIeltsWritingPartDto) {
        const partNumberExist = await this.dataSource.getRepository(IeltsTestPart).findOne({
            where: {
                testId: data.testId,
                partNumber: data.partNumber
            }
        })
        if(partNumberExist) throw new BadRequestException('Part number is already exist.')

        // Check number of part
        const partList = await this.dataSource.getRepository(IeltsTestPart).find({
            where: {
                testId: data.testId
            }
        })
        if (partList.length >= 2) throw new BadRequestException('Number of writing part is maximum.')

        const ieltsTestPart = new IeltsTestPart()
        ieltsTestPart.testId = data.testId
        ieltsTestPart.partNumber = data.partNumber

        await this.dataSource.getRepository(IeltsTestPart).save(ieltsTestPart)

        const ieltsWritingPartDetail = new IeltsWritingPartDetail()
        ieltsWritingPartDetail.partId = ieltsTestPart.id
        ieltsWritingPartDetail.content = data.content
        await this.dataSource.getRepository(IeltsWritingPartDetail).save(ieltsWritingPartDetail)
        
        return {
            ieltsTestPart,
            ieltsWritingPartDetail
        } 
    }

    async updateIeltsListeningPart(data: UpdateIeltsListeningPartDto) {
        const ieltsListeningPartDetail = await this.dataSource.getRepository(IeltsListeningPartDetail).findOneBy({ partId: data.partId })
        if (!ieltsListeningPartDetail) throw new BadRequestException(`Part detail id ${data.partId} is not exist.`)
        ieltsListeningPartDetail.audioSrc = data.audioSrc
        return await this.dataSource.getRepository(IeltsListeningPartDetail).save(ieltsListeningPartDetail)
    }

    async updateIeltsReadingPart(data: UpdateIeltsReadingPartDto) {
        const ieltsReadingPartDetail = await this.dataSource.getRepository(IeltsReadingPassage).findOneBy({ partId: data.id })
        if (!ieltsReadingPartDetail) throw new BadRequestException(`Part detail id ${data.id} is not exist.`)
        ieltsReadingPartDetail.title = data.title
        ieltsReadingPartDetail.paragraphs = data.paragraphs
        return await this.dataSource.getRepository(IeltsReadingPassage).save(ieltsReadingPartDetail)
    }

    async updateIeltsWritingPart(data: UpdateIeltsWritingPartDto) {
        const ieltsWritingPartDetail = await this.dataSource.getRepository(IeltsWritingPartDetail).findOneBy({ partId: data.id })
        if (!ieltsWritingPartDetail) throw new BadRequestException(`Part detail id ${data.id} is not exist.`)
        ieltsWritingPartDetail.content = data.content
        return await this.dataSource.getRepository(IeltsWritingPartDetail).save(ieltsWritingPartDetail)
    }
}   
