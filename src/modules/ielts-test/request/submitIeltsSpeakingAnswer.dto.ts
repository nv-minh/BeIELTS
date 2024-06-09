import { ApiProperty } from "@nestjs/swagger"
import { IsAlpha, IsArray, IsNumber, IsString } from "class-validator"

export class SubmitIeltsSpeakingAnswerDto {
    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    testResultId: number

    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    questionId: number

    @ApiProperty({
        type: Number,
        example: "Src"
    })
    @IsString()
    answer: string
}