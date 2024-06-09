import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionGroup, QuestionGroupOption, QuestionKey } from "src/database/entities";
import { QuestionGroupController } from "./question-group.controller";
import { QuestionGroupService } from "./question-group.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([QuestionGroup, QuestionKey, QuestionGroupOption])
    ],
    providers:[QuestionGroupService],
    controllers:[QuestionGroupController]
})
export class QuestionGroupModule{
    
}