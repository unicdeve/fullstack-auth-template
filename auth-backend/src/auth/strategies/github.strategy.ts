import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OAuthUserType, VerifyCallback } from 'auth/auth.types';
import { AuthService } from 'auth/services/auth.service';
import { Strategy, Profile } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('github_oauth_client_id'),
      clientSecret: configService.getOrThrow<string>('github_oauth_secret'),
      callbackURL: configService.getOrThrow<string>(
        'github_oauth_callback_url',
      ),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { emails, photos, id } = profile;

    const names = profile.displayName.split(' ');

    const oAuthUser: OAuthUserType = {
      id,
      email: emails[0].value,
      firstName: names[0] || '',
      lastName: names[1] || '',
      picture: photos[0].value,
      accessToken,
    };

    const user = await this.authService.findOAuthUserOrCreate(
      oAuthUser,
      'github',
    );

    return done(null, user);
  }
}
