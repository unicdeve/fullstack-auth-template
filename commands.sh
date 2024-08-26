# Install Nest CLI if you do not have it
npm i -g @nestjs/cli

# Create project dir
mkdir auth-template

# Start new Nest project
nest new auth-backend

# Install all the dependencies we need
# Install nest config and bcrypt for password hashing
npm i @nestjs/config bcrypt

# Install JWT and Passport strategies
npm i @nestjs/jwt passport passport-local passport-facebook passport-github2 passport-google-oauth20

# Install cookie-parser for Nest/express, if you are using Fastify, you should install @fastify/cookie
npm i cookie-parser

# Install validators
npm i class-transformer class-validator

# Install all the devDependencies if you are using Typescript
npm i --save-dev @types/bcrypt @types/cookie-parser @types/passport-facebook @types/passport-github2 @types/passport-google-oauth20 @types/passport-local

# Initialize prisma
npx prisma init

# To sync this model with your database, run:
npm run prisma:migration:save

# generate your Prisma client
npm run prisma:generate

# Install Nodemailer
npm install nodemailer

