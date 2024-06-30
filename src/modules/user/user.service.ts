import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from 'uuid';
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ChangePwdDto } from "./dto/change-pwd.dto";
import { ForgotPwdDto } from "./dto/forgot-pwd.dto";
import { ResetPwdDto } from "./dto/reset-pwd.dto";
import { User } from "src/database/entities";
import { Causes } from "src/config/exception/causes";
import { Role } from "./enums/role.enum";
import * as argon2 from 'argon2';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private jwtService: JwtService
  ) { }

  async register(data: RegisterDto) {
    let duplicateUser = await this.findUserByEmail(data.email);
    if (duplicateUser) {
      throw Causes.USER_EXISTED;
    }

    let hashPassword = await argon2.hash(data.password);
    let newUser = this.usersRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: hashPassword,
      roles: data.roles,
    });

    await this.usersRepository.save(newUser);

    let { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user || null;
  }

  async login(data: LoginDto) {
    let user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    let isPasswordMatch = await argon2.verify(user.password, data.password);
    if (!isPasswordMatch) {
      throw Causes.USER_INVALID;
    }

    let payload = {
      id: user.id,
      email: user.email,
      roles: user.roles
    };

    let accessToken = this.jwtService.sign(payload);

    return {
      ...payload,
      accessToken
    }
  }

  async logout(user: User) {
    // Your logout logic here if needed
  }

  async changePassword(data: ChangePwdDto, user: User) {
    let isPasswordMatch = await argon2.verify(user.password, data.oldPassword);
    if (!isPasswordMatch) {
      throw new HttpException(
          'Old password is not correct',
          HttpStatus.BAD_REQUEST
      )
    }

    let hashPassword = await argon2.hash(data.newPassword);
    user.password = hashPassword;

    await this.usersRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async me(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }
}
