import { Body, Controller, Delete, Get, Param, Post, Query, } from "@nestjs/common/decorators";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { QuestionGroupService } from "./question-group.service";
import { CreateQuestionGroupDto } from "./request/question-group.dto";
import { DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { CreateSpeakingQuestions } from "./request/create-speaking-question.dto";
import { CreateOneSpeakingQuestion } from "./request/create-one-speaking-quesion.dto";

@Controller('question-group')
@ApiTags('question-group')
export class QuestionGroupController{
    constructor(
        private readonly questionGroupService: QuestionGroupService
    ){

    }

    @Post('/create')
    async createQuestionGroup(@Body() body: CreateQuestionGroupDto){
        return this.questionGroupService.createQuestionGroup(body)
    }

    @Post('/create-speaking-question')
    async createSpeakingQuestion(@Body() body: CreateSpeakingQuestions){
        return this.questionGroupService.createSpeakingQuestion(body)
    }

    @Post('/create-one-speaking-question')
    async createOneSpeakingQuestion(@Body() body: CreateOneSpeakingQuestion){
        return this.questionGroupService.createOneSpeakingQuestion(body)
    }

    @Delete('/delete/:id')
    async deleteQuestionGroup(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.questionGroupService.deleteQuestionGroup(id)
    }

    // @Get('/list')
    // @ApiQuery({
    //     name:'page',
    //     required: false,
    //     type: Number
    // })
    // @ApiQuery({
    //     name:'limit',
    //     required: false,
    //     type: Number
    // })
    // @ApiQuery({
    //     name:'partId',
    //     required: true,
    //     type: Number
    // })
    // async getQuestionGroupList(
    //     @Query('page', new DefaultValuePipe(1)) page: number,
    //     @Query('limit', new DefaultValuePipe(10)) limit: number,
    //     @Query('partId', ParseIntPipe) partId: number,

    // ){
    //     return this.questionGroupService.getQuestionGroupList({partId},{page,limit})
    // }

    // async getQuestionGroupListByTestId(
    //     @Query('testId', ParseIntPipe) testId: number,

    // ){
    //     return this.questionGroupService.getQuestionGroupListByTestId(testId)
    // }
}