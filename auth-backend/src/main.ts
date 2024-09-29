import { NestFactory } from '@nestjs/core';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ApiExceptionFilter } from 'api-exception.filter';
import { ApiValidationPipe } from 'api-validation.pipe';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();

  /**
   * This is a workaround to add the setHeader and end methods to the reply object
   * because passport.js is an express middleware and doesn't exactly work well with fastify
   * TODO: We can remove this once nestjs has a support for the fastify-passport package
   */
  fastifyInstance.addHook('onRequest', (request, reply, done) => {
    (reply as any).setHeader = function (key, value) {
      return this.raw.setHeader(key, value);
    };
    (reply as any).end = function () {
      this.raw.end();
    };
    (request as any).res = reply;
    done();
  });

  const configService = app.get(ConfigService);
  const cookieSecret = configService.getOrThrow<string>('cookie.secret');

  await app.register(fastifyCookie, {
    secret: cookieSecret,
  });

  const clientOrigin = configService.getOrThrow<string>(
    'frontend_client_origin',
  );

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
