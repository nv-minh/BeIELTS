import { ApiProperty } from "@nestjs/swagger"
import { IsAlpha, IsArray, IsNumber } from "class-validator"

export class SubmitIeltsWritingAnswersDto {
    @ApiProperty({
        type: Array,
        example: [
            {
                partId: 1,
                answer: "This is my answer 1"
            },
            {
                partId: 2,
                answer: "This is my answer 2"
            }
        ]
    })
    @IsArray()
    userAnswers: any[]
}