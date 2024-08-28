import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';

// You could also store the keyId inside the JWT header.kid instead,
// And extract it from the token header, but I chose to statically pass the keyId
// around because I want to skip decoding the token first
export enum SecretKeyId {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
  MagicLink = 'magic_link',
  ResetPasswordLink = 'reset_password_link',
}

type SecretConfigType = {
  envName: string;
  secret: string;
};

type SecretType = {
  current: SecretConfigType;
  previous: SecretConfigType;
};

@Injectable()
export class SecretService {
  private readonly logger = new Logger(SecretService.name);
  private readonly secretKeys: SecretKeyId[] = [
    SecretKeyId.AccessToken,
    SecretKeyId.RefreshToken,
    SecretKeyId.MagicLink,
    SecretKeyId.ResetPasswordLink,
  ];

  constructor(private readonly configService: ConfigService) {}

  get(keyId: SecretKeyId) {
    const secret = this.configService.getOrThrow<SecretType>(
      `${keyId}.secrets`,
    );
    return {
      current: secret.current.secret,
      previous: secret.previous.secret,
    };
  }

  getCurrent(keyId: SecretKeyId) {
    return this.get(keyId).current;
  }

  @Cron('0 0 1 * *', { name: 'rotate_secrets' })
  async handleSecretsRotation() {
    try {
      await this.rotateSecrets();
      this.logger.log('Secrets rotated successfully');
    } catch (error) {
      this.logger.error('Failed to rotate secrets', error.stack);
    }
  }

  private generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  private async rotateSecrets(): Promise<void> {
    const envConfig = dotenv.parse(await fs.readFile('.env'));

    const rotatedSecrets = this.getRotatedSecrets();

    rotatedSecrets.forEach((secrets) => {
      this.configService.set(secrets.previous.propPath, secrets.previous);
      this.configService.set(secrets.current.propPath, secrets.current);

      envConfig[secrets.previous.envName] = secrets.previous.secret;
      envConfig[secrets.current.envName] = secrets.current.secret;
    });

    const updatedEnvConfig = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    await fs.writeFile('.env', updatedEnvConfig);

    // If you are using other secret manager like AWS KMS, Google Secret Manager, etc
    // make sure to update those too
  }

  private getRotatedSecrets() {
    return this.secretKeys.map((keyId) => {
      const secret = this.configService.getOrThrow<SecretType>(
        `${keyId}.secrets`,
      );

      return {
        previous: {
          ...secret.previous,
          secret: secret.current.secret,
          propPath: `${keyId}.secrets.previous`,
        },
        current: {
          ...secret.current,
          secret: this.generateSecret(),
          propPath: `${keyId}.secrets.current`,
        },
      };
    });
  }
}
