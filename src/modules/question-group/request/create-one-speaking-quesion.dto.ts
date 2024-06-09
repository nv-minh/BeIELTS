import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOneSpeakingQuestion {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  partId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  questionNumber: number;

  @ApiProperty({
    type: String,
    example: 'This is a question',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
