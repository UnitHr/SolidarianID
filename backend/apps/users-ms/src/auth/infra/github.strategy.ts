import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Strategy } from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { emails } = profile;

    let email = emails && emails.length > 0 ? emails[0].value : null;

    if (!email) {
      const emailData = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Find the primary email in the list
      const primaryEmail = emailData.data.find(
        (email) => email.primary && email.verified,
      );
      if (primaryEmail) {
        email = primaryEmail.email;
      }
    }

    if (!email) {
      return done(new Error('GitHub account does not provide an email'), null);
    }

    const user = {
      email,
    };

    done(null, user);
  }
}
