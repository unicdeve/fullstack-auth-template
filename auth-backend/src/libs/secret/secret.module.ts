import { Module } from '@nestjs/common';

import { SecretService } from './secret.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SecretService],
  exports: [SecretService],
})
export class SecretModule {}
