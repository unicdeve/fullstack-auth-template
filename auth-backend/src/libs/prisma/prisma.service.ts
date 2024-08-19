import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

const LoggerContext = 'PrismaService';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();

    Logger.log('Prisma service connected', LoggerContext);
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();

    Logger.log('Prisma service disconnected', LoggerContext);
  }
}
