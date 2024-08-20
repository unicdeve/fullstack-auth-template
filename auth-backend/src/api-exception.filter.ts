import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { IS_PROD } from 'utils/constants';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(exception.message, exception.stack, 'ApiExceptionFilter');
    }

    if (!IS_PROD) {
      Logger.error(exception.message, 'ApiExceptionFilter');
    }

    return response.status(status).json({
      status,
      code: exception.code || 'INTERNAL_SERVER_ERROR',
      message: exception.message || 'Internal Server Error',
      data: exception.data || null,
    });
  }
}
