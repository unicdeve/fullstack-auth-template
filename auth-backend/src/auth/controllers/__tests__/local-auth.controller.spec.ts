import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthContoller } from '../local-auth.controller';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { FastifyReply } from 'fastify';
import { SignUpDto } from 'auth/dto/signup.dto';
import { RequestWithAuthUser } from 'auth/auth.types';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

// jest.mock('../../../libs/prisma/prisma.service');
// jest.mock('../../../utils/constants');

describe('LocalAuthController', () => {
  let controller: LocalAuthContoller;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    googleId: null,
    facebookId: null,
    githubId: null,
    authTokenVersion: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthService = {
    createUser: jest.fn(),
    findUserById: jest.fn(),
    incrementUserAuthTokenVersion: jest.fn(),
  };

  const mockTokenService = {
    setAuthCookies: jest.fn(),
    deleteAuthCookies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalAuthContoller],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: PrismaService, useValue: new PrismaService() },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    controller = module.get<LocalAuthContoller>(LocalAuthContoller);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user and set auth cookies', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
      };

      const mockResponse = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      mockAuthService.createUser.mockResolvedValue(mockUser);

      const result = await controller.signUp(mockResponse, signUpDto);

      expect(mockAuthService.createUser).toHaveBeenCalledWith(signUpDto);
      expect(mockTokenService.setAuthCookies).toHaveBeenCalledWith(
        mockResponse,
        mockUser,
      );
      expect(result).toEqual({
        status: 'success',
        data: mockUser,
        meta: null,
      });
    });
  });

  describe('getUser', () => {
    it('should return the authenticated user', async () => {
      const mockRequest = {
        user: { userId: '1' },
        raw: {},
        log: { error: jest.fn() },
      } as unknown as RequestWithAuthUser;

      mockAuthService.findUserById.mockResolvedValue(mockUser);

      const result = await controller.getUser(mockRequest);

      expect(mockAuthService.findUserById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        status: 'success',
        data: mockUser,
        meta: null,
      });
    });
  });

  describe('logout', () => {
    it('should delete auth cookies', async () => {
      const mockResponse = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const result = await controller.logout(mockResponse);

      expect(mockTokenService.deleteAuthCookies).toHaveBeenCalledWith(
        mockResponse,
      );
      expect(result).toEqual({
        status: 'success',
        data: null,
        meta: null,
      });
    });
  });

  describe('logoutAll', () => {
    it('should delete auth cookies and increment auth token version', async () => {
      const mockRequest = {
        user: { userId: '1' },
        raw: {},
        log: { error: jest.fn() },
      } as unknown as RequestWithAuthUser;

      const mockResponse = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const result = await controller.logoutAll(mockRequest, mockResponse);

      expect(mockTokenService.deleteAuthCookies).toHaveBeenCalledWith(
        mockResponse,
      );
      expect(
        mockAuthService.incrementUserAuthTokenVersion,
      ).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        status: 'success',
        data: null,
        meta: null,
      });
    });
  });
});
