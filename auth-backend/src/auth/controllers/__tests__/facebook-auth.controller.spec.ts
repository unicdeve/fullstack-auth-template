import { Test, TestingModule } from '@nestjs/testing';
import { FacebookAuthContoller } from '../facebook-auth.controller';
import { TokenService } from '../../services/token.service';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { RequestWithPassportUser } from 'auth/auth.types';

describe('FacebookAuthController', () => {
  let controller: FacebookAuthContoller;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: null,
    googleId: null,
    facebookId: '12345',
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
      controllers: [FacebookAuthContoller],
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<FacebookAuthContoller>(FacebookAuthContoller);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('facebookAuth', () => {
    it('should log beginning of facebook oauth', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await controller.facebookAuth();
      expect(consoleSpy).toHaveBeenCalledWith('beginning facebook oauth');
    });
  });

  describe('facebookAuthRedirect', () => {
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
        url: '/oauth/facebook/callback',
        protocol: 'http',
        ip: '127.0.0.1',
        hostname: 'localhost',
      } as unknown as RequestWithPassportUser;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      } as unknown as FastifyReply;

      await controller.facebookAuthRedirect(mockRequest, mockResponse);

      expect(mockTokenService.setAuthCookies).toHaveBeenCalledWith(
        mockResponse,
        mockUser,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(302);
      expect(mockResponse.redirect).toHaveBeenCalledWith('http://frontend');
    });
  });
});
