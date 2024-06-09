import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  IeltsReadingPassage,
  IeltsReadingQuestion,
  IeltsReadingQuestionDetail,
  IeltsReadingTest,
} from 'src/database/entities';
import { DataSource, Repository, getConnection } from 'typeorm';
import { CreateIeltsReadingQuestionDto } from './dto/ieltsReadingQuestion.dto';
import { ReadingQuestionType } from './enum/questionType.enum';

@Injectable()
export class IeltsReadingQuestionService {
  constructor(
    @InjectRepository(IeltsReadingQuestion)
    private readonly ieltsReadingQuestionRepo: Repository<IeltsReadingQuestion>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(data: CreateIeltsReadingQuestionDto) {
    const checkExist = await this.dataSource
      .createQueryBuilder(IeltsReadingTest, 'test')
      .leftJoin(IeltsReadingPassage, 'passage', 'passage.testId = test.id')
      .leftJoin(
        IeltsReadingQuestion,
        'question',
        'question.passageId = passage.id',
      )
      .where('test.id = :testId', { testId: Number(data.testId) })
      .andWhere('question.from <= :to and question.to >= :from', {
        from: data.from,
        to: data.to,
      })
      .execute();
    if (checkExist.length > 0) {
      return {
        error: 'Question Number is already exist',
      };
    }

    const question = new IeltsReadingQuestion();
    question.passageId = data.passageId;
    question.from = data.from;
    question.to = data.to;
    question.type = data.type;

    const createdQuestion = await this.ieltsReadingQuestionRepo.save(question);

    if (
      createdQuestion.type == ReadingQuestionType.YES_NO_NOT_GIVEN ||
      createdQuestion.type == ReadingQuestionType.TRUE_FALSE_NOT_GIVEN
    ) {
      const questionDetail1 = new IeltsReadingQuestionDetail();
      questionDetail1.questionId = createdQuestion.id;
      questionDetail1.title = 'listOfQuestions';
      questionDetail1.content = data.listOfQuestions;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail1);
    }

    if (createdQuestion.type == ReadingQuestionType.SUMMARY_NOTE_COMPLETION) {
      const questionDetail1 = new IeltsReadingQuestionDetail();
      questionDetail1.questionId = createdQuestion.id;
      questionDetail1.title = 'require';
      questionDetail1.content = data.require;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail1);

      const questionDetail2 = new IeltsReadingQuestionDetail();
      questionDetail2.questionId = createdQuestion.id;
      questionDetail2.title = 'title';
      questionDetail2.content = data.title;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail2);

      const questionDetail3 = new IeltsReadingQuestionDetail();
      questionDetail3.questionId = createdQuestion.id;
      questionDetail3.title = 'sumary';
      questionDetail3.content = data.summary;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail3);

      const questionDetail4 = new IeltsReadingQuestionDetail();
      questionDetail4.questionId = createdQuestion.id;
      questionDetail4.title = 'remaining';
      questionDetail4.content = data.remaining;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail4);
    }

    if (createdQuestion.type == ReadingQuestionType.SENTENCE_COMPLETION) {
      const questionDetail1 = new IeltsReadingQuestionDetail();
      questionDetail1.questionId = createdQuestion.id;
      questionDetail1.title = 'require';
      questionDetail1.content = data.require;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail1);

      const questionDetail2 = new IeltsReadingQuestionDetail();
      questionDetail2.questionId = createdQuestion.id;
      questionDetail2.title = 'listOfSentences';
      questionDetail2.content = data.listOfSentences;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail2);
    }

    if (createdQuestion.type == ReadingQuestionType.MATCHING_HEADINGS) {
      const questionDetail1 = new IeltsReadingQuestionDetail();
      questionDetail1.questionId = createdQuestion.id;
      questionDetail1.title = 'listOfHeadings';
      questionDetail1.content = data.listOfHeadings;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail1);

      const questionDetail2 = new IeltsReadingQuestionDetail();
      questionDetail2.questionId = createdQuestion.id;
      questionDetail2.title = 'listOfParagraphs';
      questionDetail2.content = data.listOfParagraphs;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail2);
    }

    if (createdQuestion.type == ReadingQuestionType.MATCHING_INFORMATION) {
      const questionDetail1 = new IeltsReadingQuestionDetail();
      questionDetail1.questionId = createdQuestion.id;
      questionDetail1.title = 'listOfObjects';
      questionDetail1.content = data.listOfObjects;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail1);

      const questionDetail2 = new IeltsReadingQuestionDetail();
      questionDetail2.questionId = createdQuestion.id;
      questionDetail2.title = 'listOfStatements';
      questionDetail2.content = data.listOfStatements;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail2);
    }

    if (
      createdQuestion.type === ReadingQuestionType.LIST_SELECTION ||
      createdQuestion.type === ReadingQuestionType.MULTIPLE_CHOICE
    ) {
      const questionDetail1 = new IeltsReadingQuestionDetail();
      questionDetail1.questionId = createdQuestion.id;
      questionDetail1.title = 'question';
      questionDetail1.content = data.question;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail1);

      const questionDetail2 = new IeltsReadingQuestionDetail();
      questionDetail2.questionId = createdQuestion.id;
      questionDetail2.title = 'listOfAnswers';
      questionDetail2.content = data.listOfAnswers;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail2);
    }

    if (createdQuestion.type === ReadingQuestionType.MATCHING_ENDINGS) {
      const questionDetail1 = new IeltsReadingQuestionDetail();
      questionDetail1.questionId = createdQuestion.id;
      questionDetail1.title = 'listOfEndings';
      questionDetail1.content = data.listOfEndings;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail1);

      const questionDetail2 = new IeltsReadingQuestionDetail();
      questionDetail2.questionId = createdQuestion.id;
      questionDetail2.title = 'listOfStatements';
      questionDetail2.content = data.listOfStatements;
      await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .save(questionDetail2);
    }

    const questionDetailAnswer = new IeltsReadingQuestionDetail();
    questionDetailAnswer.questionId = createdQuestion.id;
    questionDetailAnswer.title = 'answers';
    questionDetailAnswer.content = data.answers;
    await this.dataSource
      .getRepository(IeltsReadingQuestionDetail)
      .save(questionDetailAnswer);

    return createdQuestion;
  }

  async getQuestionByPassageId(passageId) {
    const questions = await this.dataSource
      .createQueryBuilder(IeltsReadingQuestion, 'IeltsReadingQuestion')
      .where('passageId = :passageId', { passageId })
      .select('*')
      .orderBy('IeltsReadingQuestion.from', 'ASC')
      .execute();
    for (const question of questions) {
      const questionDetails = await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .find({
          where: {
            questionId: question.id,
          },
        });
      question['detail'] = {};
      for (const questionDetail of questionDetails) {
        question.detail[questionDetail.title] = questionDetail.content;
      }
    }
    return questions;
  }

  async getQuestionById(id) {
    const question = await this.ieltsReadingQuestionRepo.findOne({
      where: {
        id,
      },
    });
    const questionDetails = await this.dataSource
      .getRepository(IeltsReadingQuestionDetail)
      .find({
        where: {
          questionId: question.id,
        },
      });

    question['detail'] = {};
    for (const questionDetail of questionDetails) {
      question['detail'][questionDetail.title] = questionDetail.content;
    }

    return question;
  }

  async getPoint(data) {
    let point = 0;
    for (let i = 0; i < data.length; i++) {
      const questionDetail = await this.dataSource
        .getRepository(IeltsReadingQuestionDetail)
        .findOne({
          where: {
            questionId: data[i].questionId,
            title: 'answers',
          },
        });
      const answersDb = JSON.parse(questionDetail.content);
      for (let j = 0; j < data[i].answers.length; j++) {
        if (data[i].answers[j]) {
          // console.log(data[i].answers[j])
          // console.log(answersDb[j])
          if (data[i].answers[j].trim() == answersDb[j]) {
            // console.log(2)
            point++;
          }
        }
      }
    }

    return { point };
  }

  async deleteQuestion(questionId) {
    const checkExist = await this.ieltsReadingQuestionRepo.findOne({
      where: {
        id: questionId,
      },
    });
    if (!checkExist) return { error: 'ID not exist' };
    await this.ieltsReadingQuestionRepo.delete({ id: questionId });
    await this.dataSource
      .getRepository(IeltsReadingQuestionDetail)
      .delete({ questionId });
    return true;
  }
}
