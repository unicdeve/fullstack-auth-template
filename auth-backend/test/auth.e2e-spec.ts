import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'libs/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Local Authentication', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    };

    it('/local-auth/signup-with-password (POST) - should create a new user', () => {
      return request(app.getHttpServer())
        .post('/local-auth/signup-with-password')
        .send(signupDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe('success');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.email).toBe(signupDto.email);
          expect(res.body.data).not.toHaveProperty('password');
        });
    });

    it('/local-auth/signin-with-password (POST) - should authenticate user', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/local-auth/signup-with-password')
        .send(signupDto);

      // Then try to login
      return request(app.getHttpServer())
        .post('/local-auth/signin-with-password')
        .send({
          email: signupDto.email,
          password: signupDto.password,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe('success');
          expect(res.body.data).toBeDefined();
        });
    });

    it.skip('/local-auth/me (GET) - should get authenticated user', async () => {
      // First create and login a user
      await request(app.getHttpServer())
        .post('/local-auth/signup-with-password')
        .send(signupDto);

      const loginResponse = await request(app.getHttpServer())
        .post('/local-auth/signin-with-password')
        .send({
          email: signupDto.email,
          password: signupDto.password,
        });

      const cookies = loginResponse.headers['set-cookie'];

      return request(app.getHttpServer())
        .get('/local-auth/me')
        .set('Cookie', cookies)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('success');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.email).toBe(signupDto.email);
        });
    });

    it.skip('/local-auth/logout (DELETE) - should logout user', async () => {
      // First create and login a user
      await request(app.getHttpServer())
        .post('/local-auth/signup-with-password')
        .send(signupDto);
      const loginResponse = await request(app.getHttpServer())
        .post('/local-auth/signin-with-password')
        .send({
          email: signupDto.email,
          password: signupDto.password,
        });

      const cookies = loginResponse.headers['set-cookie'];

      return request(app.getHttpServer())
        .delete('/local-auth/logout')
        .set('Cookie', cookies)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('success');
          expect(res.body.data).toBeNull();
        });
    });
  });

  describe('OAuth Authentication', () => {
    it('/oauth/google (GET) - should redirect to Google OAuth', () => {
      return request(app.getHttpServer()).get('/oauth/google').expect(302);
    });

    it('/oauth/facebook (GET) - should redirect to Facebook OAuth', () => {
      return request(app.getHttpServer()).get('/oauth/facebook').expect(302);
    });

    it('/oauth/github (GET) - should redirect to Github OAuth', () => {
      return request(app.getHttpServer()).get('/oauth/github').expect(302);
    });
  });

  describe('Magic Link Authentication', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    };

    it.skip('/magic-link/request (POST) - should send magic link email', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/local-auth/signup-with-password')
        .send(signupDto);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for user creation

      return request(app.getHttpServer())
        .post('/magic-link/request')
        .send({ email: signupDto.email })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('success');
        });
    }, 20000);
  });

  describe('Password Reset', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    };

    it.skip('/forget-password (POST) - should send reset email', async () => {
      // Create a user first
      await request(app.getHttpServer())
        .post('/local-auth/signup-with-password')
        .send(signupDto);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for user creation

      return request(app.getHttpServer())
        .post('/forget-password')
        .send({ email: signupDto.email })
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe('success');
        });
    }, 20000);
  });
});
