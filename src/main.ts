import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  
  const config = new DocumentBuilder()
    .setTitle('Ielts Test')
    .setDescription('The ielts test API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // Set the format of your bearer token (e.g., JWT)
    }, 'bearer') // 'bearer' here should match the security name used in the security decorator in your controller
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);

}
bootstrap();
