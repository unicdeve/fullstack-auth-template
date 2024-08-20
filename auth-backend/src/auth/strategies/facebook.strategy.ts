import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OAuthUserType, VerifyCallback } from 'auth/auth.types';
import { AuthService } from 'auth/services/auth.service';
import { Strategy, Profile } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('facebook_oauth_client_id'),
      clientSecret: configService.get<string>('facebook_oauth_secret'),
      callbackURL: configService.get<string>('facebook_oauth_callback_url'),
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, name, emails, profileUrl } = profile;
    const oAuthUser: OAuthUserType = {
      id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: profileUrl,
      accessToken,
    };

    const user = await this.authService.findOAuthUserOrCreate(
      oAuthUser,
      'facebook',
    );

    return done(null, user);
  }
}
