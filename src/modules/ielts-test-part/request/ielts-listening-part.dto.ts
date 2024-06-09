import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Binary } from "typeorm"


export class CreateIeltsListeningPartDto{
    @ApiProperty({
        type: Number,
        example: 1
    })
    testId: number

    @ApiProperty({
        type: Number,
        example: 1
    })
    partNumber: number 

    @ApiProperty({
        type: String,
        example: 'https://www.youtube.com/watch?v=1QqgShOjQ2g'
    })
    audioSrc: string 
}

export class UpdateIeltsListeningPartDto extends CreateIeltsListeningPartDto{
    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNotEmpty()
    partId: number 

    @ApiProperty({
        type: String,
        example: 'https://www.youtube.com/watch?v=1QqgShOjQ2g'
    })
    audioSrc: string 
}