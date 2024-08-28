import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type SecretKeyId =
  | 'access_token'
  | 'refresh_token'
  | 'magic_link'
  | 'reset_password_link';

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
  constructor(private configService: ConfigService) {}

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
}
