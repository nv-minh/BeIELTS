import { DataSourceOptions } from "typeorm";
import { IeltsListeningPartDetail, QuestionGroup, QuestionKey, IeltsReadingPassage, IeltsReadingQuestion, IeltsReadingQuestionDetail, IeltsReadingTest, User, QuestionGroupOption, IeltsTest, IeltsWritingPartDetail, UserAnswer, TestResult } from "src/database/entities";
import { IeltsTestPart } from "../database/entities/IeltsTestPart.entity";

require('dotenv').config()

export const databaseConfig: DataSourceOptions = {
    type: (process.env.TYPEORM_CONNECTION || "mysql") as any,
    host: process.env.TYPEORM_HOST || "localhost",
    port: parseInt(process.env.TYPEORM_PORT) || 3306,
    username: process.env.TYPEORM_USERNAME || 'root',
    password: process.env.TYPEORM_PASSWORD || '',
    database: process.env.TYPEORM_DATABASE || 'ielts',
    entities: [
        IeltsReadingTest,
        IeltsReadingPassage,
        IeltsReadingQuestion,
        IeltsReadingQuestionDetail,
        User,
        IeltsTest,
        IeltsTestPart,
        IeltsListeningPartDetail,
        QuestionGroup,
        QuestionKey,
        QuestionGroupOption,
        IeltsWritingPartDetail,
        UserAnswer,
        TestResult
    ],
    synchronize: true
}
