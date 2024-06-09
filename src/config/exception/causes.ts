import { HttpException, HttpStatus } from '@nestjs/common';

export class Causes {
  public static USER_EXISTED = new HttpException(
    'User existed',
    HttpStatus.BAD_REQUEST,
  );

  public static USER_NOT_FOUND = new HttpException(
    'User not found',
    HttpStatus.NOT_FOUND,
  );

  public static ADMIN_EXISTED = new HttpException(
    'Admin existed',
    HttpStatus.BAD_REQUEST,
  );

  public static ADMIN_NOT_FOUND = new HttpException(
    'Admin not found',
    HttpStatus.NOT_FOUND,
  );


  public static GROUP_EXISTED = new HttpException(
    'User existed',
    HttpStatus.BAD_REQUEST,
  );

  public static GROUP_NOT_FOUND = new HttpException(
    'User not found',
    HttpStatus.NOT_FOUND,
  );

  public static QUIZ_NOT_FOUND = new HttpException(
    'Quiz not found',
    HttpStatus.NOT_FOUND,
  );

  public static QUIZ_EXISTED = new HttpException(
    'Quiz existed',
    HttpStatus.BAD_REQUEST,
  );

  public static USER_INVALID = new HttpException(
    'User or password invalid',
    HttpStatus.BAD_REQUEST,
  );

  public static FILE_SIZE_OVER = new HttpException(
    ['Upload file size exceeds the allowed limit'],
    HttpStatus.BAD_REQUEST,
  );

  public static FILE_TYPE_INVALID = new HttpException(
    ['File type upload invalid'],
    HttpStatus.BAD_REQUEST,
  );

  public static LOCK_NAME_ALREADY_EXISTS = new HttpException(
    ['Lock name already exists'],
    HttpStatus.BAD_REQUEST,
  );

  public static LOCK_NOT_FOUND = new HttpException(
    ['Lock not found'],
    HttpStatus.BAD_REQUEST,
  );

  public static NOT_PERMITTED = new HttpException(
    ['Not permitted'],
    HttpStatus.UNAUTHORIZED,
  );

  public static TOKEN_EXPIRED = new HttpException(
    ['Token expired'],
    HttpStatus.BAD_REQUEST,
  );

  public static TIME_SETTING_ERROR = new HttpException(
    ['Time setting error'],
    HttpStatus.BAD_REQUEST,
  );
}
