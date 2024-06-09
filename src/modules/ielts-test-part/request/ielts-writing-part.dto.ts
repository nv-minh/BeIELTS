import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"


export class CreateIeltsWritingPartDto {
    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    testId: number

    @ApiProperty({
        type: String,
        example: 1
    })
    content: string 

    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    partNumber: number 
}


export class UpdateIeltsWritingPartDto {
    @ApiProperty({
        type: Number,
        example:1
    })
    @IsNotEmpty()
    id: number

    @ApiProperty({
        type: String,
        example: 1
    })
    content: string 
}