import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, } from "@nestjs/common/decorators";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";

import { BadRequestException, ParseIntPipe } from "@nestjs/common";
import { IeltsTestPartService } from "./ielts-test-part.service";
import { CreateIeltsListeningPartDto, UpdateIeltsListeningPartDto } from "./request/ielts-listening-part.dto";
import { CreateIeltsReadingPartDto, UpdateIeltsReadingPartDto } from "./request/ielts-reading-part.dto";
import { ConfigService } from "@nestjs/config";
import { CreateIeltsSpeakingPartDto } from "./request/ielts-speaking-part.dto";
import { CreateIeltsWritingPartDto, UpdateIeltsWritingPartDto } from "./request/ielts-writing-part.dto";
import { JwtAuthGuard } from "../user/jwt-auth.guard";

@Controller('ielts-test-part')
@ApiTags('ielts-test-part')
export class IeltsTestPartController{
    
    constructor(
        private readonly ieltsPartService: IeltsTestPartService,
    ){

    }

    @Post('/create-ielts-listening-part')
    async createIeltsListeningPart(@Body() body: CreateIeltsListeningPartDto)
        {
        return this.ieltsPartService.createIeltsListeningPart(body)
    }

    @Post('/create-ielts-reading-part')
    async createIeltsReadingPart(@Body() body: CreateIeltsReadingPartDto){
        return this.ieltsPartService.createIeltsReadingPart(body)
    }

    @Post('/create-ielts-speaking-part')
    async createIeltsSpeakingPart(@Body() body: CreateIeltsSpeakingPartDto){
        return this.ieltsPartService.createIeltsSpeakingPart(body)
    }

    @Post('/create-ielts-writing-part')
    async createIeltsWritingPart(@Body() body: CreateIeltsWritingPartDto){
        return this.ieltsPartService.createIeltsWritingPart(body)
    }

    @Post('listening/update')
    async updateIeltsListeningPart(@Body() body: UpdateIeltsListeningPartDto) {
        return this.ieltsPartService.updateIeltsListeningPart(body)
    }

    @Post('reading/update')
    async updateIeltsReadingPart(@Body() body: UpdateIeltsReadingPartDto) {
        return this.ieltsPartService.updateIeltsReadingPart(body)
    }

    @Post('writing/update')
    async updateIeltsWritingPart(@Body() body: UpdateIeltsWritingPartDto) {
        return this.ieltsPartService.updateIeltsWritingPart(body)
    }

    @Get('/list/:testId')
    async getIeltsTestPartList(
        @Param('testId', ParseIntPipe) testId: number,

    ){
        return this.ieltsPartService.getIeltsTestPartList(testId)
    }

    @Get('/speaking-part-list/:testId')
    async getIeltsSpeakingPartList(
        @Param('testId', ParseIntPipe) testId: number,

    ){
        return this.ieltsPartService.getIeltsSpeakingPartList(testId)
    }

    @Get('/writing-part-list/:testId')
    async getIeltsWritingPartList(
        @Param('testId', ParseIntPipe) testId: number,

    ){
        return this.ieltsPartService.getIeltsWritingPartList(testId)
    }
    
}