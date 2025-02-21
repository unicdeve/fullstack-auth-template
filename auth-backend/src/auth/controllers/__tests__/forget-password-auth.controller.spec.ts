import { Test, TestingModule } from '@nestjs/testing';
import { ForgetPasswordAuthController } from '../forget-password-auth.controller';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { MailerQueueService } from 'libs/mailer/mailer-queue.service';

describe('ForgetPasswordAuthController', () => {
  let controller: ForgetPasswordAuthController;

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

  const mockServices = {
    configService: {
      getOrThrow: jest.fn().mockReturnValue('http://frontend'),
    },
    authService: {
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      updateUserPassword: jest.fn(),
    },
    tokenService: {
      generateResetPasswordLinkToken: jest.fn(),
      verifyResetPasswordLinkToken: jest.fn(),
    },
    mailerQueueService: {
      addForgetPasswordLink: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgetPasswordAuthController],
      providers: [
        { provide: ConfigService, useValue: mockServices.configService },
        { provide: AuthService, useValue: mockServices.authService },
        { provide: TokenService, useValue: mockServices.tokenService },
        {
          provide: MailerQueueService,
          useValue: mockServices.mailerQueueService,
        },
      ],
    }).compile();

    controller = module.get<ForgetPasswordAuthController>(
      ForgetPasswordAuthController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestResetPasswordLink', () => {
    it('should send reset password link email for existing user', async () => {
      const email = 'test@example.com';
      mockServices.authService.findUserByEmail.mockResolvedValue(mockUser);
      mockServices.tokenService.generateResetPasswordLinkToken.mockResolvedValue(
        'token123',
      );

      const result = await controller.requestResetPasswordLink(email);

      expect(mockServices.authService.findUserByEmail).toHaveBeenCalledWith(
        email,
      );
      expect(
        mockServices.tokenService.generateResetPasswordLinkToken,
      ).toHaveBeenCalledWith(mockUser);
      expect(
        mockServices.mailerQueueService.addForgetPasswordLink,
      ).toHaveBeenCalledWith(
        email,
        'http://frontend/forget-password/reset?token=token123',
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

      await expect(controller.requestResetPasswordLink(email)).rejects.toThrow(
        'User with this email does not exist',
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      const resetPasswordDto = {
        token: 'valid-token',
        newPassword: 'newPassword123',
      };

      mockServices.tokenService.verifyResetPasswordLinkToken.mockResolvedValue({
        userId: '1',
      });

      const result = await controller.resetPassword(resetPasswordDto);

      expect(
        mockServices.tokenService.verifyResetPasswordLinkToken,
      ).toHaveBeenCalledWith(resetPasswordDto.token);
      expect(mockServices.authService.updateUserPassword).toHaveBeenCalledWith({
        userId: '1',
        newPassword: resetPasswordDto.newPassword,
      });
      expect(result).toEqual({
        status: 'success',
        data: null,
        meta: null,
      });
    });
  });
});
