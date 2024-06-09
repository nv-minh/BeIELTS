import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsNotEmpty, IsNumber, IsString, MinLength, isEmail, isString } from "class-validator"
import { IELTS_TEST_TYPE } from "../../../shared/constant"

export class IeltsTestDto {
    @ApiProperty({
        type: String,
        example: "name"
    })
    @IsNotEmpty()
    name: string

    @ApiProperty({
        type: String,
        example: IELTS_TEST_TYPE.LISTENING
    })
    @IsIn(Object.values(IELTS_TEST_TYPE))
    type: string
}

export class UpdateIeltsTestDto extends IeltsTestDto {
    @ApiProperty({
        type: Number,
        example:1
    })
    @IsNotEmpty()
    id: number
}