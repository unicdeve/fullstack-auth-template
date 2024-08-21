import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ApiExceptionFilter } from 'api-exception.filter';
import { ApiValidationPipe } from 'api-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('cookie_secret');

  // You can add more secrets for rotations
  app.use(cookieParser([cookieSecret]));

  const clientOrigin = configService.get<string>('foontend_client_origin');

  app.enableCors({
    origin: [clientOrigin],
    credentials: true,
    maxAge: 86400,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
  });

  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalPipes(new ApiValidationPipe());

  const port = configService.get<number>('port');

  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  Logger.log(`Listening on port ${port}`, 'NestApplication');
}
bootstrap();
