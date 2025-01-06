import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { StatisticsService } from './statistic.service';
import { HandlebarsHelpersService } from 'src/helper.service';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly handlebarsHelpersService: HandlebarsHelpersService,
  ) {}

  @Get()
  @Render('platform-admin/statistics')
  async getCommunitiesByODS(@Req() req, @Res() res) {
    const user = req.cookies.user;
    if (!user) {
      return res.redirect('/login');
    }
    const datasByOds = await this.statisticsService.getDataByODS(user.token);

    const datasByCommunity = await this.statisticsService.getDataByCommunity(
      user.token,
    );

    return {
      datasByOds: JSON.stringify(datasByOds),
      datasByCommunity: JSON.stringify(datasByCommunity),
      user: user,
      activePage: 'adminDashboard',
      title: 'Statistics',
    };
  }
}
