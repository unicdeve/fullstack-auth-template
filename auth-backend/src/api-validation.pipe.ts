import { HttpStatus, ValidationPipe } from '@nestjs/common';

export class ApiValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const errorsAsResponse = () =>
          errors.map((error) => {
            const hasChildren = error.children && error.children.length > 0;

            if (hasChildren) {
              return {
                [error.property]: Object.keys(
                  error.children[0].constraints,
                ).map((code) => error.children[0].constraints[code])[0],
              };
            }

            return {
              [error.property]: Object.keys(error.constraints).map(
                (code) => error.constraints[code],
              )[0],
            };
          });

        const data = errorsAsResponse();

        return {
          status: HttpStatus.BAD_REQUEST,
          code: '"ERR_BAD_REQUEST"',
          message: Object.values(data[0])[0],
          data,
        };
      },
    });
  }
}
