import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { IeltsReadingQuestionService } from "./ieltsReadingQuestion.service";
import { CreateIeltsReadingQuestionDto } from "./dto/ieltsReadingQuestion.dto";
import { ApiTags } from "@nestjs/swagger";
import { ResultDto } from "./dto/result.dto";

@Controller('ielts-reading-question')
@ApiTags('ielts-reading-question')
export class IeltsReadingQuestionController {
    constructor(
        private readonly ieltsReadingQuestionService: IeltsReadingQuestionService
    ) {

    }
    @Post('/create')
    async create(
        @Body() data: CreateIeltsReadingQuestionDto 
    ) {
        return this.ieltsReadingQuestionService.create(data)
    }

    @Get('/:passageId/questions')
    async getQuestionByPassageId(
        @Param('passageId', ParseIntPipe) passageId: number
    ){
        return this.ieltsReadingQuestionService.getQuestionByPassageId(passageId)
    }

    @Get('/:id')
    async getQuestionById(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.ieltsReadingQuestionService.getQuestionById(id)
    }
    
    @Post('/get-point')
    async getPoint(
        @Body() data: ResultDto 
    ) {
        return this.ieltsReadingQuestionService.getPoint(data.results)
    }

    @Delete('/:questionId')
    async deleteQuestion(
        @Param('questionId', ParseIntPipe) questionId: number
    ) {
        return this.ieltsReadingQuestionService.deleteQuestion(questionId)
    }
}