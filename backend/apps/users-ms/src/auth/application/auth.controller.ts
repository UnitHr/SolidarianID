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
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: { username: string; password: string }) {
    return this.authService.signIn(signInDto.username, signInDto.password);
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
