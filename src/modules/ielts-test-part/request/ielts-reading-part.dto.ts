import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"


export class CreateIeltsReadingPartDto {
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
    
    @ApiProperty({
        type: String,
        example: "title"
    })
    @IsString()
    title: string 

    @ApiProperty({
        type: String,
        example: "paragraphs"
    })
    @IsString()
    paragraphs: string 
}


export class UpdateIeltsReadingPartDto {
    @ApiProperty({
        type: Number,
        example:1
    })
    @IsNotEmpty()
    id: number

    @ApiProperty({
        type: String,
        example: "title"
    })
    @IsString()
    title: string 

    @ApiProperty({
        type: String,
        example: "paragraphs"
    })
    @IsString()
    paragraphs: string 
}