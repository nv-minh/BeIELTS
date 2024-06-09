import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common/pipes';
import { IeltsTestService } from './ielts-test.service';
import { IeltsTestDto, UpdateIeltsTestDto } from './request/ielts-test.dto';
import { JwtAuthGuard } from '../user/jwt-auth.guard';
import { UserAnswersDto } from './request/user-answers.dto';
import { SubmitIeltsListeningAndReadingAnswers } from './request/submitIeltsListeningAndReadingAnswers.dto';
import { SubmitIeltsWritingAnswersDto } from './request/submitIeltsWritingAnswers.dto';
import { Role } from '../user/enums/role.enum';
import { EvaluateWritingPartAnswerDto } from './request/evaluateWritingTestAnswer.dto';
import { SubmitIeltsSpeakingAnswerDto } from './request/submitIeltsSpeakingAnswer.dto';
import { CreateTestResultDto } from './request/createTestResult.dto';
import { EvaluateSpeakingTestAnswerDto } from './request/evaluateSpeakingTestAnswer.dto';

@Controller('ielts-test')
@ApiTags('ielts-test')
export class IeltsTestController {
  constructor(private readonly ieltsTestService: IeltsTestService) {}

  @Post('/create')
  async createIeltsTest(@Body() body: IeltsTestDto) {
    return this.ieltsTestService.createIeltsTest(body);
  }

  @Get('/list')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
  })
  async getList(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('name') name: string,
    @Query('type') type: string,
  ) {
    return this.ieltsTestService.getList({ name, type }, { page, limit });
  }

  @Get('/get-many-test-results')
  @ApiQuery({
    name: 'testId',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
  })
  async getManyTestResults(
    @Query('testId') testId: string,
    @Query('userId') userId: string,
  ) {
    return this.ieltsTestService.getManyTestResults({
      filter: { testId: Number(testId) || 0, userId: Number(userId) },
    });
  }

  @Get('/test-result-list')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  async getTestResultList(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('type') type: string,
    @Query('status') status: string,
  ) {
    return this.ieltsTestService.getTestResultList(
      { type, status },
      { page, limit },
    );
  }

  @Get('/get-average-score-by-frequency')
  @ApiQuery({
    name: 'testType',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'frequency',
    required: true,
    type: String,
  })
  async getAverageScoreByFrequency(
    @Query('testType') testType: string,
    @Query('userId', ParseIntPipe) userId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('frequency') frequency: string,
  ) {
    return this.ieltsTestService.getAverageScoreByFrequency({
      filter: {
        testType,
        userId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      frequency,
    });
  }

  @Get(':id')
  async getIeltsTestById(@Param('id', ParseIntPipe) id: number) {
    return this.ieltsTestService.getIeltsTestById(id);
  }

  @Post('get-score')
  async getScore(@Body() body: UserAnswersDto) {
    return this.ieltsTestService.getScore(body);
  }

  @Put('/update')
  async update(@Body() data: UpdateIeltsTestDto) {
    return this.ieltsTestService.update(data);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.ieltsTestService.delete(id);
  }

  @Get('/test-result/:id')
  async getTestResultById(@Param('id', ParseIntPipe) id: number) {
    return this.ieltsTestService.getTestResultById(id);
  }

  @Get('/latest-test-result/:testId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async getLatestTestResult(
    @Param('testId', ParseIntPipe) testId: number,
    @Req() req: any,
  ) {
    return this.ieltsTestService.getLatestTestResult(testId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @Post('/submit-ielts-listening-and-reading-answers')
  async submitIeltsListeningAndReadingAnswers(
    @Body() body: SubmitIeltsListeningAndReadingAnswers,
    @Req() req: any,
  ) {
    return this.ieltsTestService.submitIeltsListeningAndReadingAnswers(
      body,
      req.user.id,
    );
  }

  @Post('/submit-ielts-writing-answers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async submitIeltsWritingAnswers(
    @Body() body: SubmitIeltsWritingAnswersDto,
    @Req() req: any,
  ) {
    return this.ieltsTestService.submitIeltsWritingAnswers(body, req.user.id);
  }

  @Post('/submit-ielts-speaking-answer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async submitIeltsSpeakingAnswer(
    @Body() body: SubmitIeltsSpeakingAnswerDto,
    @Req() req: any,
  ) {
    return this.ieltsTestService.submitIeltsSpeakingAnswer(body, req.user.id);
  }

  @Post('/create-test-result')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async createTestResult(@Body() body: CreateTestResultDto, @Req() req: any) {
    return this.ieltsTestService.createTestResult(body, req.user.id);
  }

  @Post('/request-to-get-evaluated-by-examiner')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async requestToGetEvaluatedByExaminer(
    @Body() body: { testResultId: number },
    @Req() req: any,
  ) {
    return this.ieltsTestService.requestToGetEvaluatedByExaminer(
      body.testResultId,
      req.user.id,
    );
  }

  @Post('/evaluate-writing-part-answer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async evaluateWritingPartAnswer(
    @Body() body: EvaluateWritingPartAnswerDto,
    @Req() req: any,
  ) {
    if (!req.user.roles.includes(Role.Examiner))
      throw new Error('You are not examiner.');
    return this.ieltsTestService.evaluateWritingPartAnswer(body, req.user);
  }

  @Post('/evaluate-speaking-test-answer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async evaluateSpeakingTestAnswer(
    @Body() body: EvaluateSpeakingTestAnswerDto,
    @Req() req: any,
  ) {
    if (!req.user.roles.includes(Role.Examiner))
      throw new Error('You are not examiner.');
    return this.ieltsTestService.evaluateSpeakingTestAnswer(body, req.user);
  }
}
