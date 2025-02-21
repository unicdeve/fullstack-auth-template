import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthContoller } from '../google-auth.controller';
import { TokenService } from '../../services/token.service';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { RequestWithPassportUser } from 'auth/auth.types';

describe('GoogleAuthController', () => {
  let controller: GoogleAuthContoller;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: null,
    googleId: '12345',
    facebookId: null,
    githubId: null,
    authTokenVersion: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTokenService = {
    setAuthCookies: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('http://frontend'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleAuthContoller],
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<GoogleAuthContoller>(GoogleAuthContoller);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuth', () => {
    it('should log beginning of google oauth', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await controller.googleAuth();
      expect(consoleSpy).toHaveBeenCalledWith('beginning google oauth');
    });
  });

  describe('googleAuthRedirect', () => {
    it('should set auth cookies and redirect to frontend', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'request-id',
        params: {},
        query: {},
        body: null,
        headers: {},
        raw: {
          id: 'raw-request-id',
        },
        log: {
          info: jest.fn(),
          error: jest.fn(),
        },
        method: 'GET',
        url: '/oauth/google/callback',
        protocol: 'http',
        ip: '127.0.0.1',
        hostname: 'localhost',
      } as unknown as RequestWithPassportUser;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      } as unknown as FastifyReply;

      await controller.googleAuthRedirect(mockRequest, mockResponse);

      expect(mockTokenService.setAuthCookies).toHaveBeenCalledWith(
        mockResponse,
        mockUser,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(302);
      expect(mockResponse.redirect).toHaveBeenCalledWith('http://frontend');
    });
  });
});
