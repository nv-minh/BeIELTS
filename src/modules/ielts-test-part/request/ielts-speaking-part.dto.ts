import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"


export class CreateIeltsSpeakingPartDto {
    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    testId: number

    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    partNumber: number 
}


export class UpdateIeltsSpeakingPartDto extends CreateIeltsSpeakingPartDto{
    @ApiProperty({
        type: Number,
        example:1
    })
    @IsNotEmpty()
    id: number
}