import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateTestResultDto {
    @ApiProperty({
        type: String,
        example: 1
    })
    @IsNumber()
    testId: number
}