import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { envs } from '@users-ms/config';
import axios from 'axios';
import { Profile } from 'passport';
import { Strategy } from 'passport-github';

interface GithubUser {
  email: string;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly githubApiEmailsUrl = 'https://api.github.com/user/emails';

  constructor() {
    super({
      clientID: envs.githubClientId,
      clientSecret: envs.githubClientSecret,
      callbackURL: envs.githubCallbackUrl,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user?: GithubUser) => void,
  ) {
    const { emails } = profile;

    let email = emails && emails.length > 0 ? emails[0].value : null;

    if (!email) {
      const emailData = await axios.get(this.githubApiEmailsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Find the primary email in the list
      const primaryEmail = emailData.data.find((e) => e.primary && e.verified);
      if (primaryEmail) {
        email = primaryEmail.email;
      }
    }

    if (!email) {
      return done(new Error('GitHub account does not provide an email'), null);
    }

    const user: GithubUser = {
      email,
    };

    done(null, user);
    return user;
  }
}
