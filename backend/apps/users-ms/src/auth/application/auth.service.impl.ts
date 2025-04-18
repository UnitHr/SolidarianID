import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { UserService } from '../../users/application/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  logger = new Logger(AuthServiceImpl.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.getUserByEmail(email);
      const isPasswordValid = await user.isValidPassword(password);

      if (!isPasswordValid) {
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

  async signOauth2(
    userId: UniqueEntityID,
    userEmail: string,
    role: string,
  ): Promise<{ access_token: string }> {
    try {
      if (!userId || !userEmail || !role) {
        throw new Error('Invalid data');
      }

      // Payload for the JWT
      const payload = { sub: userId, email: userEmail, roles: role };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error('Error signing in', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
