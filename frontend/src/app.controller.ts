import {
  Get,
  Controller,
  Render,
  Request,
  Body,
  Res,
  Post,
  Req,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { HandlebarsHelpersService } from './helper.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Constants } from './common/constants';
import { AppService } from './app.service';

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
  async authenticate(@Body() body, @Res() res) {
    const { email, password } = body;
    try {
      const loginResponse = await axios.post(Constants.USER_MS_LOGIN, {
        email,
        password,
      });

      const token = loginResponse.data.access_token;

      if (!token) {
        throw new HttpException('Token not provided', HttpStatus.FORBIDDEN);
      }

      const playload = jwt.verify(token, Constants.TOKEN_SECRET);

      const userResponse = await axios.get(
        Constants.USER_MS_bASE_URL + '/' + playload.sub.value,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const userData = {
        firstName: userResponse.data.firstName,
        lastName: userResponse.data.lastName,
        roles: playload.roles,
        token: token,
      };

      res.cookie('user', userData, {
        httpOnly: true,
        maxAge: 3600000, // expires in 1 hour
        sameSite: 'strict', // CSRF protection
      });

      // redirect to home page with token
      res.redirect('/');
    } catch (error) {
      console.log(error);
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

  @Get('/validation')
  @Render('platform-admin/validation')
  async getValidation(@Query('page') page = 1, @Request() req) {
    // check if user is authenticated
    const user = req.cookies.user;
    if (!user) {
      return { title: 'Home', activePage: 'home' };
    }
    // Pagination: 10 items per page
    const offset = (page - 1) * 10;
    const limit = 10;
    const results = await this.appService.getCreateCommunityRequests(
      offset,
      limit,
    );

    return {
      user: user,
      title: 'Validation',
      activePage: 'adminDashboard',
      requests: results.data,
      page,
      totalPages: Math.ceil(results.total / limit),
    };
  }

  @Get('/statistics')
  @Render('platform-admin/statistics')
  getStatistics() {
    return {
      title: 'Statistics',
      activePage: 'adminDashboard',
      userAutenticate: true,
    };
  }

  @Get('/reports')
  @Render('platform-admin/reports')
  getReports() {
    return {
      title: 'Reports',
      activePage: 'adminDashboard',
      userAutenticate: true,
    };
  }
}
