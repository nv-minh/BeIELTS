import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common/decorators";
import { DefaultValuePipe, ParseIntPipe } from "@nestjs/common/pipes";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { IeltsReadingPassageService } from "./ieltsReadingPassage.service";
import { IeltsReadingPassageDto, UpdateIeltsReadingPassageDto } from "./request/ieltsReadingPassage.dto";

@Controller('ielts_reading_passage')
@ApiTags('ielts_reading_passage')
export class IeltsReadingPassageController{
    constructor(
        private readonly ieltsReadingPassageService:IeltsReadingPassageService
    ){

    }
}