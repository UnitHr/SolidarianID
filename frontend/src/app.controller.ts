import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('home')
  home() {
    return { title: 'Home' };
  }

  @Get('/login')
  @Render('login')
  getLogin() {
    return { title: 'Login' };
  }

  @Get('/register')
  @Render('register')
  getRegister() {
    return { title: 'Register' };
  }
}
