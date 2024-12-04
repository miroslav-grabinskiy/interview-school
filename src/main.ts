
import * as dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips out properties that are not part of the DTO
      forbidNonWhitelisted: true, // throws error if non-whitelisted properties are sent
      transform: true, // transforms plain objects into class instances
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Calendar API')
    .setDescription('The Calendar API description')
    .setVersion('1.0')
    .addTag('calendar')
    .addBearerAuth() // если используете авторизацию
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
