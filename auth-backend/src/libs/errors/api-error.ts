import { HttpStatus } from '@nestjs/common';

export const StatusCode = HttpStatus;

export default class ApiError extends Error {
  message: string;
  code: string;
  data: any;
  status: HttpStatus;

  constructor(status: HttpStatus, code?: string, message?: string, data?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;

    Error.captureStackTrace(this, ApiError);
  }
}
