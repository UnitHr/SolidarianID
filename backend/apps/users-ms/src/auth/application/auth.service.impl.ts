import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/application/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Payload for the JWT
    const payload = { sub: user.id, email: user.email, roles: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signOauth2(email: string): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid autentication');
    }
    // Payload for the JWT
    const payload = { sub: user.id, email: user.email, roles: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
