import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiExcludeController()
@Controller('users/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: { email: string; password: string }) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return token;
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // necessary as the starting point of the authentication
    // left empty
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res() res) {
    // Generates the JWT token with the user's information
    const token = await this.authService.signOauth2(req.user.email);
    // Returns the JWT token as part of the response
    return res.json({ token });
  }
}
