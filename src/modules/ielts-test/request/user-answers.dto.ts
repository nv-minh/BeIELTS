import { ApiProperty } from "@nestjs/swagger"
import { IsAlpha, IsArray, IsIn, IsNotEmpty, IsNumber, IsString, MinLength, isEmail, isString } from "class-validator"
import { IELTS_TEST_TYPE } from "../../../shared/constant"

export class UserAnswersDto {
    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNotEmpty()
    testId: number

    @ApiProperty({
        type: Array,
        example: [{
            questionId: 1,
            answer: "A"
        }]
    })
    @IsArray()
    @IsNotEmpty()
    userAnswers: any[]
}