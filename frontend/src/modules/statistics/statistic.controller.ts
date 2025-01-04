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
    const data = await this.statisticsService.getCommunitiesCausesByODS(
      user.token,
    );

    const supportsByOds = await this.statisticsService.getSupportsByODS(
      user.token,
    );

    const supportsByCommunity =
      await this.statisticsService.getSupportsByCommunity(user.token);

    const actionsProgressByCommunity =
      await this.statisticsService.getActionsProgressByCommunity(user.token);

    return {
      data: JSON.stringify(data.communitiesByOds),
      supportsByOds: JSON.stringify(supportsByOds.supportPercentageByODS),
      supportsByCommunity: JSON.stringify(
        supportsByCommunity.supportPercentageByCommunity,
      ),
      actionsProgressByCommunity: JSON.stringify(
        actionsProgressByCommunity.actionsProgressByCommunity,
      ),
      user: user,
      activePage: 'adminDashboard',
      title: 'Statistics',
    };
  }
}
