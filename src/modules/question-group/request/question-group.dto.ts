import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { QUESTION_TYPE } from "../../../shared/constant"
import { Optional } from "@nestjs/common"


export class CreateQuestionGroupDto{
    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    partId: number

    @ApiProperty({
        type: String,
        example: 'Multiple Choice'
    })
    @IsString()
    @IsIn(Object.values(QUESTION_TYPE))
    type: string

    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    from: number

    @ApiProperty({
        type: Number,
        example: 1
    })
    @Optional()
    to: number

    @ApiProperty({
        type: String,
        example: 'content'
    })
    @IsString()
    content: string

    @ApiProperty({
        type: String,
        example: 'ALPHABET'
    })
    @IsOptional()
    typeOfLabel: string

    @ApiProperty({
        type: Array,
        example: ['A','B','C','D']
    })
    @IsOptional()
    listOfOptions: string[]

    @ApiProperty({
        type: Array,
        example: ['A','B','C','D']
    })
    @IsNotEmpty()
    listOfKeys: string[]

    @ApiProperty({
        type: Array,
        example: ['A','B','C','D']
    })
    listOfQuestions: string[]
}

