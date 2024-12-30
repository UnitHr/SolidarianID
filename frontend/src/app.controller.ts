import { Get, Controller, Render } from '@nestjs/common';
import { HandlebarsHelpersService } from './helper.service';

@Controller()
export class AppController {
  constructor(
    private readonly handlebarsHelpersService: HandlebarsHelpersService,
  ) {}

  @Get()
  @Render('home')
  home() {
    return { title: 'Home', activePage: 'home' };
  }

  @Get('/login')
  @Render('login')
  getLogin() {
    return { title: 'Login', activePage: 'login' };
  }

  @Get('/register')
  @Render('register')
  getRegister() {
    return { title: 'Register', activePage: 'register' };
  }

  @Get('/validation')
  @Render('platform-admin/validation')
  getValidation() {
    return { title: 'Validation', activePage: 'admin' };
  }

  @Get('/statistics')
  @Render('platform-admin/statistics')
  getStatistics() {
    return { title: 'Statistics', activePage: 'admin' };
  }

  @Get('/reports')
  @Render('platform-admin/reports')
  getReports() {
    return { title: 'Reports', activePage: 'admin' };
  }
}
