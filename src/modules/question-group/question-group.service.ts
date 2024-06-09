import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { getArrayPaginationBuildTotal, getOffset } from 'src/shared/Utils';
import { DataSource, LessThan, LessThanOrEqual, MoreThanOrEqual, QueryResult, Repository } from 'typeorm';
import {
  IeltsListeningPartDetail,
  QuestionKey,
  QuestionGroup,
  QuestionGroupOption,
} from '../../database/entities';
import { CreateQuestionGroupDto } from './request/question-group.dto';
import { QUESTION_TYPE, TYPE_OF_QUESTION_LABEL } from '../../shared/constant';
import { IeltsTestPart } from '../../database/entities/IeltsTestPart.entity';
import { CreateSpeakingQuestions } from './request/create-speaking-question.dto';
import { CreateOneSpeakingQuestion } from './request/create-one-speaking-quesion.dto';

@Injectable()
export class QuestionGroupService {
  constructor(
    @InjectRepository(QuestionGroup)
    private questionGroupRepo: Repository<QuestionGroup>,

    @InjectRepository(QuestionKey)
    private questionKeyRepo: Repository<QuestionKey>,

    @InjectRepository(QuestionGroupOption)
    private questionGroupOptionRepo: Repository<QuestionGroupOption>,

    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async createQuestionGroup(data: CreateQuestionGroupDto) {
    const part = await this.dataSource.getRepository(IeltsTestPart).findOneBy({ id: data.partId });
    if (!part) throw new BadRequestException(`Part id ${data.partId} is not exist.`);

    // Check question number
    let isExistQuestionNumber = null
    if (data.from) {
      isExistQuestionNumber = await this.dataSource.getRepository(QuestionKey).findOneBy({
        testId: part.testId,
        questionNumber: data.from,
      });
    } else if (data.from && data.to) {
      if (data.from > data.to) throw new BadRequestException(`Field "from" must be less than or equal to field "to".`);
      for (let i = data.from; i <= data.to; i++) {
        isExistQuestionNumber = await this.dataSource.getRepository(QuestionKey).findOneBy({
          testId: part.testId,
          questionNumber: i,
        });
        if (isExistQuestionNumber) break;
      }
    }
    if (isExistQuestionNumber) throw new BadRequestException(`Question number ${isExistQuestionNumber.questionNumber} is already exist.`);

    const questionGroup = new QuestionGroup();
    questionGroup.testId = part.testId;
    questionGroup.partId = data.partId;
    questionGroup.type = data.type;
    questionGroup.from = data.from;
    questionGroup.to = data.to;
    questionGroup.content = data.content;
    
    const listOfOptions = data.listOfOptions;
    const listOfKeys = data.listOfKeys;
    const listOfQuestions = data.listOfQuestions;

    // Validate some rules
    if ([QUESTION_TYPE.FILL_IN_THE_BLANKS, QUESTION_TYPE.TRUE_FALSE_NOT_GIVEN].includes(questionGroup.type)) {
      if (!questionGroup.to) throw new BadRequestException(`Field "to" is required.`);
      if (listOfKeys.length !== questionGroup.to - questionGroup.from + 1) throw new BadRequestException(`Number of keys must be equal to number of questions.`);
    }

    if (questionGroup.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
      if (listOfOptions.length < 2) throw new BadRequestException(`Number of options must be greater than 1.`);
    }

    if (listOfKeys?.length > 0) {
      listOfKeys.forEach(key => {
        if (!key) throw new BadRequestException(`Question keys is required.`);
      })
    }

    await this.questionGroupRepo.save(questionGroup);

    // Create question key
    const questionKeys: any = [];
    if (questionGroup.type === QUESTION_TYPE.FILL_IN_THE_BLANKS) {
      for (let i = questionGroup.from; i <= questionGroup.to; i++) {
        const questionKey = new QuestionKey();
        questionKey.testId = part.testId;
        questionKey.partId = part.id
        questionKey.questionGroupId = questionGroup.id;
        questionKey.questionNumber = i;
        questionKey.key = listOfKeys[i - questionGroup.from].trim();
        questionKeys.push(questionKey);
      } 

      await this.questionKeyRepo.save(questionKeys);
    }

    if (questionGroup.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
      const questionGroupOptions = [];
      for (const [index, option] of listOfOptions.entries()) {
        const questionGroupOption = new QuestionGroupOption();
        questionGroupOption.questionGroupId = questionGroup.id;
        questionGroupOption.label = TYPE_OF_QUESTION_LABEL.ALPHABET.value[index];
        questionGroupOption.content = option;
        questionGroupOptions.push(questionGroupOption);
      }
      await this.questionGroupOptionRepo.save(questionGroupOptions);

      const questionKey = new QuestionKey();
      questionKey.testId = part.testId;
      questionKey.partId = part.id
      questionKey.questionGroupId = questionGroup.id;
      questionKey.questionNumber = questionGroup.from;
      questionKey.key = listOfKeys[0];
      await this.questionKeyRepo.save(questionKey);
    }

    if (questionGroup.type === QUESTION_TYPE.TRUE_FALSE_NOT_GIVEN) {
      for (let i = questionGroup.from; i <= questionGroup.to; i++) {
        const questionKey = new QuestionKey();
        questionKey.testId = part.testId;
        questionKey.partId = part.id
        questionKey.questionGroupId = questionGroup.id;
        questionKey.questionNumber = i;
        questionKey.key = listOfKeys[i - questionGroup.from]?.trim();
        questionKey.content = listOfQuestions[i - questionGroup.from]?.trim();
        questionKeys.push(questionKey);
      } 
      await this.questionKeyRepo.save(questionKeys);
    }

    if (questionGroup.type === QUESTION_TYPE.MATCHING) {
      const questionGroupOptions = [];
      for (const [index, option] of listOfOptions.entries()) {
        const questionGroupOption = new QuestionGroupOption();
        questionGroupOption.questionGroupId = questionGroup.id;
        questionGroupOption.label = TYPE_OF_QUESTION_LABEL.ALPHABET.value[index];
        questionGroupOption.content = option;
        questionGroupOptions.push(questionGroupOption);
      }
      await this.questionGroupOptionRepo.save(questionGroupOptions);

      for (let i = questionGroup.from; i <= questionGroup.to; i++) {
        const questionKey = new QuestionKey();
        questionKey.testId = part.testId;
        questionKey.partId = part.id
        questionKey.questionGroupId = questionGroup.id;
        questionKey.questionNumber = i;
        questionKey.key = listOfKeys[i - questionGroup.from]?.trim();
        questionKey.content = listOfQuestions[i - questionGroup.from]?.trim();
        questionKeys.push(questionKey);
      } 
      await this.questionKeyRepo.save(questionKeys);
    }

    return questionGroup
  }

  async createSpeakingQuestion(data: CreateSpeakingQuestions) {
    const part = await this.dataSource.getRepository(IeltsTestPart).findOneBy({ id: data.partId });
    if (!part) throw new BadRequestException(`Part id ${data.partId} is not exist.`);

    const questionNumbers = data.listOfQuestions.map(question => question.questionNumber);
    const questionNumberSet = new Set(questionNumbers);
    if (questionNumbers.length !== questionNumberSet.size) throw new BadRequestException(`Question number must be unique.`);

    // Check question number exist
    for (const questionNumber of questionNumbers) {
      const isExistQuestionNumber = await this.dataSource.getRepository(QuestionKey).findOneBy({
        testId: part.testId,
        questionNumber: questionNumber,
      });
      if (isExistQuestionNumber) throw new BadRequestException(`Question number ${isExistQuestionNumber.questionNumber} is already exist.`);
    }

    const questions = [];
    for (const question of data.listOfQuestions) {
      const questionKey = new QuestionKey();
      questionKey.testId = part.testId;
      questionKey.partId = part.id
      questionKey.partId = data.partId;
      questionKey.questionNumber = question.questionNumber;
      questionKey.content = question.content;
      questions.push(questionKey);
    }

    return await this.questionKeyRepo.save(questions);
  }

  async createOneSpeakingQuestion(data: CreateOneSpeakingQuestion) {
    const part = await this.dataSource.getRepository(IeltsTestPart).findOneBy({ id: data.partId });
    if (!part) throw new BadRequestException(`Part id ${data.partId} is not exist.`);

    const isExistQuestionNumber = await this.dataSource.getRepository(QuestionKey).findOneBy({
      testId: part.testId,
      questionNumber: data.questionNumber,
    });
    if (isExistQuestionNumber) throw new BadRequestException(`Question number ${isExistQuestionNumber.questionNumber} is already exist.`);

    const questionKey = new QuestionKey();
    questionKey.testId = part.testId;
    questionKey.partId = part.id
    questionKey.partId = data.partId;
    questionKey.questionNumber = data.questionNumber;
    questionKey.content = data.content;

    return await this.questionKeyRepo.save(questionKey);
  }

  async deleteQuestionGroup(id: number) {
    const questionGroup = await this.questionGroupRepo.findOneBy({ id });
    if (!questionGroup) throw new BadRequestException(`Question group id ${id} is not exist.`);

    await this.questionGroupRepo.delete(id);
    await this.questionKeyRepo.delete({ questionGroupId: id });
    await this.questionGroupOptionRepo.delete({ questionGroupId: id });

    return { message: `Delete question group id ${id} successfully.` };
  }

  
}
