import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { envs } from '@users-ms/config';
import { Profile } from 'passport';
import { Strategy } from 'passport-github';

interface GithubUser {
  githubId: string;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: envs.githubClientId,
      clientSecret: envs.githubClientSecret,
      callbackURL: envs.githubCallbackUrl,
      scope: [], // No hace falta pedir emails ni nada más
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user?: GithubUser) => void,
  ) {
    const user: GithubUser = {
      githubId: profile.id,
    };

    done(null, user);
    return user;
  }
}
