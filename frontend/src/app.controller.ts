import {
  Get,
  Controller,
  Render,
  Body,
  Res,
  Post,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HandlebarsHelpersService } from './helper.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { AppService } from './app.service';
import { envs } from './config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly handlebarsHelpersService: HandlebarsHelpersService,
  ) {}

  @Get()
  @Render('home')
  async home(@Req() req) {
    const user = req.cookies.user;
    if (!user) {
      return { title: 'Home', activePage: 'home' };
    }
    return { user: user, title: 'Home', activePage: 'home' };
  }

  @Post('authenticate')
  async authenticate(@Body() body: any, @Res() res) {
    res.clearCookie('user');
    const { email, password } = body;

    if (!email || !password) {
      throw new HttpException(
        'Email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const loginResponse = await axios.post(envs.userMsLogin, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (
        !loginResponse ||
        !loginResponse.data ||
        !loginResponse.data.access_token
      ) {
        throw new HttpException(
          'Invalid login response',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = loginResponse.data.access_token;

      let playload;
      try {
        playload = jwt.verify(token, envs.tokenSecret);
      } catch (err) {
        console.error('Invalid token:', err.message);
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const userId = playload.sub?.value;
      if (!userId) {
        throw new HttpException(
          'Invalid token payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userResponse = await axios.get(`${envs.userMsBaseUrl}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse || !userResponse.data) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const userData = {
        firstName: userResponse.data.firstName,
        lastName: userResponse.data.lastName,
        roles: playload.roles,
        token: token,
      };

      res.cookie('user', userData, {
        httpOnly: true,
        maxAge: 3600000, // 1h
        sameSite: 'strict',
      });

      res.redirect('/');
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.render('login', { error: 'Invalid credentials' });
    }
  }

  @Get('/login')
  @Render('login')
  getLogin() {
    return {
      title: 'Login',
      activePage: 'login',
    };
  }

  @Get('/register')
  @Render('register')
  getRegister() {
    return {
      title: 'Register',
      activePage: 'register',
    };
  }
  @Get('/logout')
  logout(@Res() res) {
    res.clearCookie('user');
    res.redirect('/');
  }
}
