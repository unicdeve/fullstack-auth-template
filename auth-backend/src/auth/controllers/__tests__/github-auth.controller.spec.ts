import { Test, TestingModule } from '@nestjs/testing';
import { GithubAuthContoller } from '../github-auth.controller';
import { TokenService } from '../../services/token.service';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { RequestWithPassportUser } from 'auth/auth.types';

describe('GithubAuthController', () => {
  let controller: GithubAuthContoller;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: null,
    googleId: null,
    facebookId: null,
    githubId: '12345',
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
      controllers: [GithubAuthContoller],
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<GithubAuthContoller>(GithubAuthContoller);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('githubAuth', () => {
    it('should log beginning of github oauth', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await controller.githubAuth();
      expect(consoleSpy).toHaveBeenCalledWith('beginning github oauth');
    });
  });

  describe('githubAuthRedirect', () => {
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
        url: '/oauth/github/callback',
        protocol: 'http',
        ip: '127.0.0.1',
        hostname: 'localhost',
      } as unknown as RequestWithPassportUser;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      } as unknown as FastifyReply;

      await controller.githubAuthRedirect(mockRequest, mockResponse);

      expect(mockTokenService.setAuthCookies).toHaveBeenCalledWith(
        mockResponse,
        mockUser,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(302);
      expect(mockResponse.redirect).toHaveBeenCalledWith('http://frontend');
    });
  });
});
