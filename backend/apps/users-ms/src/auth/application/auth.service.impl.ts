import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/application/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  logger = new Logger(AuthServiceImpl.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.getUserByEmail(email);

      if (!user.isValidPassword(password)) {
        throw new UnauthorizedException('Invalid password');
      }

      // Payload for the JWT
      const payload = { sub: user.id, email: user.email, roles: user.role };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error('Error signing in', error);
      throw new UnauthorizedException('Invalid email');
    }
  }

  async signOauth2(email: string): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.getUserByEmail(email);

      // Payload for the JWT
      const payload = { sub: user.id, email: user.email, roles: user.role };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error('Error signing in', error);
      throw new UnauthorizedException('Email not registered');
    }
  }
}
