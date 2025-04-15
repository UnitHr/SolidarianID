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
import { UserService } from '../../users/application/user.service';

@ApiExcludeController()
@Controller('users/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

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
    const { githubId } = req.user; // Solo tomamos el githubId del perfil

    const user = await this.usersService.findByGithubId(githubId);

    if (user) {
      // Si el usuario existe, generamos el token JWT
      const token = await this.authService.signOauth2(
        user.id,
        user.email,
        user.role,
      );
      return res.json({ exists: true, githubId, ...token });
    }

    // Si no existe, respondemos con la info de que debe registrarse
    return res.json({ exists: false, githubId });
  }
}
