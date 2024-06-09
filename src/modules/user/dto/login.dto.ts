import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, example: 'levanchien220801@gmail.com'})
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true, example: 'Password1@'})
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'a password between 6 to 20 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'})
  readonly password: string;
  
  @ApiProperty({ required: false, example: 'true'})
  @IsOptional()
  @IsBooleanString()
  readonly rememberMe: string;
}