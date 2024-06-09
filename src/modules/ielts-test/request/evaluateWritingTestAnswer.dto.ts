import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class EvaluateWritingPartAnswerDto {
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
    partId: number

    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    score: number

    @ApiProperty({
        type: String,
        example: 'This is a comment'
    })
    comment: string
}