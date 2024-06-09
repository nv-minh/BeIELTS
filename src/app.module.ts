import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { IeltsReadingPassageModule } from './modules/ieltsReadingPassage/ieltsReadingPassage.module';
import { IeltsReadingQuestionModule } from './modules/IeltsReadingQuestion/ieltsReadingQuestion.module';
import { UserModule } from './modules/user/user.module';
import { IeltsTestModule } from './modules/ielts-test/ielts-test.module';
import { QuestionGroupModule } from './modules/question-group/question-group.module';
import { TransformInterceptor } from './config/rest/transform.interceptor';
import { IeltsTestPart } from './database/entities/IeltsTestPart.entity';
import { IeltsTestPartModule } from './modules/ielts-test-part/ielts-test-part.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './modules/upload-aws-s3/update.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot({ isGlobal: true}),
    UploadModule,
    UserModule,
    IeltsReadingPassageModule,
    IeltsReadingQuestionModule,
    IeltsTestModule,
    IeltsTestPartModule,
    QuestionGroupModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: "APP_INTERCEPTOR",
      useClass: TransformInterceptor,
    }
  ],
})
export class AppModule {
}
