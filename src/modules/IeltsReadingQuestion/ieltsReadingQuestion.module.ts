import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IeltsReadingQuestionController } from "./ieltsReadingQuestion.controller";
import { IeltsReadingQuestionService } from "./ieltsReadingQuestion.service";
import { IeltsReadingQuestion } from "../../database/entities/IeltsReadingQuestion.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([IeltsReadingQuestion])
    ],
    controllers: [IeltsReadingQuestionController],
    providers: [IeltsReadingQuestionService]
})
export class IeltsReadingQuestionModule {

}
