import { assertDefined } from 'utils/assert-defined';
import { IS_PROD, MIN_SECRET_LENGTH } from 'utils/constants';

export const assertConfig = () => {
  assertDefined(process.env.DATABASE_URL, 'DATABASE_URL is missing!');
  assertDefined(process.env.JWT_ISSUER, 'JWT_ISSUER is missing!');
  assertDefined(process.env.JWT_AUDIENCE, 'JWT_AUDIENCE is missing!');

  assertDefined(
    process.env.ACCESS_TOKEN_SECRET_1,
    'ACCESS_TOKEN_SECRET_1 is missing!',
  );
  assertDefined(
    process.env.ACCESS_TOKEN_SECRET_1?.length > MIN_SECRET_LENGTH,
    `ACCESS_TOKEN_SECRET_1 should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
  );
  assertDefined(
    process.env.ACCESS_TOKEN_SECRET_0,
    'ACCESS_TOKEN_SECRET_0 is missing!',
  );
  assertDefined(
    process.env.ACCESS_TOKEN_SECRET_0?.length > MIN_SECRET_LENGTH,
    `ACCESS_TOKEN_SECRET_0 should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
  );

  assertDefined(
    process.env.RESET_PASSWORD_LINK_SECRET_0,
    'RESET_PASSWORD_LINK_SECRET_0 is missing!',
  );
  assertDefined(
    process.env.RESET_PASSWORD_LINK_SECRET_0?.length > MIN_SECRET_LENGTH,
    `RESET_PASSWORD_LINK_SECRET_0 should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
  );
  assertDefined(
    process.env.RESET_PASSWORD_LINK_SECRET_1,
    'RESET_PASSWORD_LINK_SECRET_1 is missing!',
  );
  assertDefined(
    process.env.RESET_PASSWORD_LINK_SECRET_1?.length > MIN_SECRET_LENGTH,
    `RESET_PASSWORD_LINK_SECRET_1 should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
  );

  assertDefined(
    process.env.REFRESH_TOKEN_SECRET_1,
    'REFRESH_TOKEN_SECRET_1 is missing!',
  );
  assertDefined(
    process.env.REFRESH_TOKEN_SECRET_1?.length > MIN_SECRET_LENGTH,
    `REFRESH_TOKEN_SECRET_1 should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
  );
  assertDefined(
    process.env.REFRESH_TOKEN_SECRET_1,
    'REFRESH_TOKEN_SECRET_0 is missing!',
  );
  assertDefined(
    process.env.REFRESH_TOKEN_SECRET_0?.length > MIN_SECRET_LENGTH,
    `REFRESH_TOKEN_SECRET_0 should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
  );

  assertDefined(
    process.env.MAGIC_LINK_SECRET_0,
    'MAGIC_LINK_SECRET_0 is missing!',
  );
  assertDefined(
    process.env.MAGIC_LINK_SECRET_0?.length > MIN_SECRET_LENGTH,
    `MAGIC_LINK_SECRET_0 should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
  );
  assertDefined(
    process.env.MAGIC_LINK_SECRET_1,
    'MAGIC_LINK_SECRET_1 is missing!',
  );
  assertDefined(
    process.env.MAGIC_LINK_SECRET_1?.length > MIN_SECRET_LENGTH,
    `MAGIC_LINK_SECRET_1 should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
  );

  if (IS_PROD) {
    assertDefined(
      process.env.COOKIE_SECRET?.length > MIN_SECRET_LENGTH,
      `COOKIE_SECRET should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
    );

    assertDefined(process.env.PASSWORD_SALT, 'PASSWORD_SALT is missing!');

    assertDefined(process.env.COOKIE_SECRET, 'COOKIE_SECRET is missing!');

    assertDefined(
      process.env.FRONTEND_CLIENT_ORIGIN,
      'FRONTEND_CLIENT_ORIGIN is missing!',
    );

    assertDefined(
      process.env.REFRESH_TOKEN_EXPIRES_IN,
      'REFRESH_TOKEN_EXPIRES_IN is missing!',
    );
    assertDefined(
      process.env.ACCESS_TOKEN_EXPIRES_IN,
      'ACCESS_TOKEN_EXPIRES_IN is missing!',
    );
  }
};
