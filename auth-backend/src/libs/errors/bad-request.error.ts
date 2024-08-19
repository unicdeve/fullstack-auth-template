import ApiError, { StatusCode } from './api-error';

export const BadRequestError = (code: string, message: string) => {
  const data = [{ [code]: message }];

  return new ApiError(
    StatusCode.BAD_REQUEST,
    '"ERR_BAD_REQUEST"',
    message,
    data,
  );
};
