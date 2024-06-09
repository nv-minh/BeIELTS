import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateSpeakingQuestions {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  partId: number;

  @ApiProperty({
    type: [Object],
    example: [
      {
        questionNumber: 1,
        content: 'This is a question',
      },
    ],
  })
  @IsArray()
  listOfQuestions: {
    questionNumber: number;
    content: string;
  }[];
}
