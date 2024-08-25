import { assertDefined } from 'utils/assert-defined';
import { IS_PROD, MIN_SECRET_LENGTH } from 'utils/constants';

export const config = () => {
  assertDefined(process.env.DATABASE_URL, 'DATABASE_URL is missing!');
  assertDefined(process.env.JWT_ISSUER, 'JWT_ISSUER is missing!');
  assertDefined(process.env.JWT_AUDIENCE, 'JWT_AUDIENCE is missing!');

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
      process.env.ACCESS_TOKEN_EXPIRES_IN,
      'ACCESS_TOKEN_EXPIRES_IN is missing!',
    );

    assertDefined(
      process.env.REFRESH_TOKEN_EXPIRES_IN,
      'REFRESH_TOKEN_EXPIRES_IN is missing!',
    );

    assertDefined(
      process.env.ACCESS_TOKEN_SECRET,
      'ACCESS_TOKEN_SECRET is missing!',
    );
    assertDefined(
      process.env.ACCESS_TOKEN_SECRET?.length > MIN_SECRET_LENGTH,
      `ACCESS_TOKEN_SECRET should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
    );

    assertDefined(
      process.env.REFRESH_TOKEN_SECRET,
      'REFRESH_TOKEN_SECRET is missing!',
    );
    assertDefined(
      process.env.REFRESH_TOKEN_SECRET?.length > MIN_SECRET_LENGTH,
      `REFRESH_TOKEN_SECRET should be a long string greater than ${MIN_SECRET_LENGTH} chararcters!`,
    );
  }

  return {
    port: parseInt(process.env.PORT, 10) || 5100,
    cookie_secret:
      process.env.COOKIE_SECRET ||
      'make sure to pass some really long secret key for cookie gen',
    access_token_secret:
      process.env.ACCESS_TOKEN_SECRET ||
      'make sure to pass some really long secret key for access token gen',
    refresh_token_secret:
      process.env.REFRESH_TOKEN_SECRET ||
      'make sure to pass some really long secret key for refresh token gen',
    /**
     * Access tokens should be short live
     * The default here means the system will query the user every 10mins in other to generate new accessToken and refreshToken
     */
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN || '10min',
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    jwt_issuer: process.env.JWT_ISSUER,
    jwt_audience: process.env.JWT_AUDIENCE,
    password_salt: parseInt(process.env.PASSWORD_SALT) || 10,
    google_oauth_secret: process.env.GOOGLE_OAUTH_SECRET,
    google_oauth_client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    google_oauth_callback_url: process.env.GOOGLE_OAUTH_CALLBACK_URL,
    facebook_oauth_secret: process.env.FACEBOOK_OAUTH_SECRET,
    facebook_oauth_client_id: process.env.FACEBOOK_OAUTH_CLIENT_ID,
    facebook_oauth_callback_url: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
    github_oauth_secret: process.env.GITHUB_OAUTH_SECRET,
    github_oauth_client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    github_oauth_callback_url: process.env.GITHUB_OAUTH_CALLBACK_URL,
    frontend_client_origin:
      process.env.FRONTEND_CLIENT_ORIGIN || 'http://localhost:3100',
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
    magic_link_secret:
      process.env.MAGIC_LINK_SECRET ||
      'make sure to pass some really long secret key for magic link token gen',
    magic_link_expires_in: process.env.MAGIC_LINK_EXPIRES_IN || '5min',
  };
};

export type ConfigType = ReturnType<typeof config>;
