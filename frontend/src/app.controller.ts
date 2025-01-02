import { Get, Controller, Render, Request } from '@nestjs/common';
import { HandlebarsHelpersService } from './helper.service';

@Controller()
export class AppController {
  constructor(
    private readonly handlebarsHelpersService: HandlebarsHelpersService,
  ) {}

  @Get()
  @Render('home')
  home(@Request() req) {
    console.log('req', req.user);
    return { user: req.user, title: 'Home', activePage: 'home' };
  }

  @Get('/login')
  @Render('login')
  getLogin(@Request() req: any) {
    return {
      user: req.user,
      title: 'Login',
      activePage: 'login',
    };
  }

  @Get('/register')
  @Render('register')
  getRegister(@Request() req: any) {
    return {
      user: req.user,
      title: 'Register',
      activePage: 'register',
    };
  }

  @Get('/validation')
  @Render('platform-admin/validation')
  getValidation(@Request() req: any) {
    return {
      user: req.user,
      title: 'Validation',
      activePage: 'adminDashboard',
      userAutenticate: true,
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
