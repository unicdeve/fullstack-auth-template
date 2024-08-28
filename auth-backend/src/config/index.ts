import { assertConfig } from './assert-config';

export const config = () => {
  assertConfig();

  return {
    port: parseInt(process.env.PORT, 10) || 5100,
    cookie: {
      secret:
        process.env.COOKIE_SECRET ||
        'make sure to pass some really long secret key for cookie gen',
    },
    jwt_issuer: process.env.JWT_ISSUER,
    jwt_audience: process.env.JWT_AUDIENCE,

    access_token: {
      secrets: {
        current: {
          envName: 'ACCESS_TOKEN_SECRET_1',
          secret: process.env.ACCESS_TOKEN_SECRET_1,
        },
        previous: {
          envName: 'ACCESS_TOKEN_SECRET_0',
          secret: process.env.ACCESS_TOKEN_SECRET_0,
        },
      },
      expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN || '10min',
    },

    refresh_token: {
      secrets: {
        current: {
          envName: 'REFRESH_TOKEN_SECRET_1',
          secret: process.env.REFRESH_TOKEN_SECRET_1,
        },
        previous: {
          envName: 'REFRESH_TOKEN_SECRET_0',
          secret: process.env.REFRESH_TOKEN_SECRET_0,
        },
      },
      expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || '10min',
    },

    magic_link: {
      secrets: {
        current: {
          envName: 'MAGIC_LINK_SECRET_1',
          secret: process.env.MAGIC_LINK_SECRET_1,
        },
        previous: {
          envName: 'MAGIC_LINK_SECRET_0',
          secret: process.env.MAGIC_LINK_SECRET_0,
        },
      },
      expires_in: process.env.MAGIC_LINK_EXPIRES_IN || '5min',
    },

    reset_password_link: {
      secrets: {
        current: {
          envName: 'RESET_PASSWORD_LINK_SECRET_1',
          secret: process.env.RESET_PASSWORD_LINK_SECRET_1,
        },
        previous: {
          envName: 'RESET_PASSWORD_LINK_SECRET_0',
          secret: process.env.RESET_PASSWORD_LINK_SECRET_0,
        },
      },
      expires_in: process.env.RESET_PASSWORD_LINK_EXPIRES_IN || '5min',
    },

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
  };
};

export type ConfigType = ReturnType<typeof config>;
