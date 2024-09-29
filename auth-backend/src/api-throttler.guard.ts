import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiThrottlerGuard extends ThrottlerGuard {
  protected errorMessage: string = 'Too Many Requests';
}
