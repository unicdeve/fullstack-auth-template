import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OAuthUserType } from 'auth/auth.types';
import { AuthService } from 'auth/services/auth.service';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('google_oauth_client_id'),
      clientSecret: configService.get<string>('google_oauth_secret'),
      callbackURL: configService.get<string>('google_oauth_callback_url'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails, photos, id } = profile;
    const oAuthUser: OAuthUserType = {
      id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    const user = await this.authService.findOAuthUserOrCreate(
      oAuthUser,
      'google',
    );

    return done(null, user);
  }
}
