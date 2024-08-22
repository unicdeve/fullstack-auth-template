# Fullstack authentication template

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
   <a href="http://nestjs.com/" target="blank"><img src="./auth-frontend/src/assets/react.svg" width="200" alt="Nest Logo" /></a>
</p>

Authentication template built with

- Backend: [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/),
  [SQLite](https://www.sqlite.org/),
  [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token),
  [Passport](https://www.passportjs.org/)
- Frontend: [React](https://react.dev/),
  [Context API](https://react.dev/reference/react/createContext),
  [React Query](https://tanstack.com/query/latest/docs/framework/react/overview),
  [Zod](https://zod.dev/), [React hook form](https://react-hook-form.com/),
  [ShadcnUI](https://ui.shadcn.com/)

## General Installations

This applies to both the frontend and backend directories, CD into them.

Make sure you have [Node.js](https://nodejs.org) and
[NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
installed with the right versions, you can use
[nvm](https://github.com/nvm-sh/nvm) to manage your node versions.

- Node version: `v20.*.*`
- NPM version: `v10.*.*`

You can use the following command to install the correct node version:

```bash
# install node version 20, this will install the latest npm version as well, v10
$ nvm install v20

# use node version 18
$ nvm use 20

```

## Running the Backend

```bash
# cd into auth-backend if you not in that dir
$ cd auth-backend

# install packages
$ npm install
```

Add the required env variables, here's an example of the required env:

```shell
DATABASE_URL="your db url"

PORT=
PASSWORD_SALT=
COOKIE_SECRET="cookie secret - some really long random string of chars, difficult to guess - used to sign the cookie"
ACCESS_TOKEN_SECRET=" some really long random string of chars, difficult to guess - used to sign the user's access token"
REFRESH_TOKEN_SECRET=" some really long random string of chars, difficult to guess - used to sign the user's refresh token"
ACCESS_TOKEN_EXPIRES_IN="15min"
REFRESH_TOKEN_EXPIRES_IN="30d"
JWT_ISSUER=http://localhost:5100
JWT_AUDIENCE=http://localhost:3100

# Github secrets, remove if you don't need it
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_SECRET=
GOOGLE_OAUTH_CALLBACK_URL=

# Facebook secrets, remove if you don't need it
FACEBOOK_OAUTH_CLIENT_ID=
FACEBOOK_OAUTH_SECRET=
FACEBOOK_OAUTH_CALLBACK_URL=

# Github secrets, remove if you don't need it
GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_SECRET=
GITHUB_OAUTH_CALLBACK_URL=

# Your client website origin
FRONTEND_CLIENT_ORIGIN=

```

Start the app with the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the Frontend

```bash
# cd into auth-backend if you not in that dir
$ cd auth-frontend

# install packages
$ npm install
```

Add the required env variables. The only required env variable is the
`VITE_BASE_API_URL`

Start the app with the following command:

```bash
# development
$ npm run dev

```

## Happy coding 🙂
