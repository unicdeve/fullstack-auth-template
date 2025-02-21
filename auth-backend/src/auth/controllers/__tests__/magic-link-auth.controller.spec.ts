import { Test, TestingModule } from '@nestjs/testing';
import { MagicLinkController } from '../magic-link-auth.controller';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { MailerQueueService } from 'libs/mailer/mailer-queue.service';
import { FastifyReply } from 'fastify';
import { PrismaService } from '../../../libs/prisma/prisma.service';

// jest.mock('../../../libs/prisma/prisma.service');
// jest.mock('../../../utils/constants');

describe('MagicLinkController', () => {
  let controller: MagicLinkController;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: null,
    googleId: null,
    facebookId: null,
    githubId: null,
    authTokenVersion: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockServices = {
    configService: {
      getOrThrow: jest.fn().mockReturnValue('http://frontend'),
    },
    authService: {
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
    },
    tokenService: {
      generateMagicLinkToken: jest.fn(),
      verifyMagicLinkToken: jest.fn(),
      setAuthCookies: jest.fn(),
    },
    mailerQueueService: {
      addMagicLink: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MagicLinkController],
      providers: [
        { provide: ConfigService, useValue: mockServices.configService },
        { provide: AuthService, useValue: mockServices.authService },
        { provide: TokenService, useValue: mockServices.tokenService },
        {
          provide: MailerQueueService,
          useValue: mockServices.mailerQueueService,
        },
        { provide: PrismaService, useValue: new PrismaService() },
      ],
    }).compile();

    controller = module.get<MagicLinkController>(MagicLinkController);
  });

  describe('requestMagicLink', () => {
    it('should send magic link email for existing user', async () => {
      const email = 'test@example.com';
      mockServices.authService.findUserByEmail.mockResolvedValue(mockUser);
      mockServices.tokenService.generateMagicLinkToken.mockResolvedValue(
        'token123',
      );

      const result = await controller.requestMagicLink({ email });

      expect(mockServices.authService.findUserByEmail).toHaveBeenCalledWith(
        email,
      );
      expect(
        mockServices.tokenService.generateMagicLinkToken,
      ).toHaveBeenCalledWith(mockUser);
      expect(mockServices.mailerQueueService.addMagicLink).toHaveBeenCalledWith(
        email,
        'http://frontend/magic-link/verify?token=token123',
      );
      expect(result).toEqual({
        status: 'success',
        data: null,
        meta: null,
      });
    });

    it('should throw error for non-existing user', async () => {
      const email = 'nonexistent@example.com';
      mockServices.authService.findUserByEmail.mockResolvedValue(null);

      await expect(controller.requestMagicLink({ email })).rejects.toThrow(
        'User with this email does not exist',
      );
    });
  });

  describe('verifyMagicLink', () => {
    it('should verify magic link token and set auth cookies', async () => {
      const token = 'valid-token';
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      mockServices.tokenService.verifyMagicLinkToken.mockResolvedValue({
        userId: '1',
      });
      mockServices.authService.findUserById.mockResolvedValue(mockUser);

      const result = await controller.verifyMagicLink({ token }, mockResponse);

      expect(
        mockServices.tokenService.verifyMagicLinkToken,
      ).toHaveBeenCalledWith(token);
      expect(mockServices.authService.findUserById).toHaveBeenCalledWith('1');
      expect(mockServices.tokenService.setAuthCookies).toHaveBeenCalledWith(
        mockResponse,
        mockUser,
      );
      expect(result).toEqual({
        status: 'success',
        data: null,
        meta: null,
      });
    });
  });
});
