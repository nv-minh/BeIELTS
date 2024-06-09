import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ChangePwdDto } from "./dto/change-pwd.dto";
import { ForgotPwdDto } from "./dto/forgot-pwd.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPwdDto } from "./dto/reset-pwd.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post('/register')
  @ApiOperation({
    summary: 'Register',
    description: 'Create a new user',
  })
  async register(@Body() data: RegisterDto) {
    return this.userService.register(data);
  }

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Req() req: any
    ) {
    return this.userService.login(data);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async me(@Req() req: any) {
    return this.userService.me(req.user)
  }

  @Get('/test')
  async test(@Req() req) {
    throw new BadRequestException('test')
    // return 'hello world'
  }


  @Post('/logout')
  async logout(@Req() req) {
    return this.userService.logout(req.user);
  }

  @Post('/change-password')
  async changePassword(
    @Body() data: ChangePwdDto,
    @Req() req
  ) {
    return this.userService.changePassword(data, req.user);
  }
}