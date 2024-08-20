import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { config } from 'config';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      cache: true,
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
