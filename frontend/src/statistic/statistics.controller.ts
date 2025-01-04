import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
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
    const token = req.cookies.user;
    if (!token) {
      return res.redirect('/login');
    }
    const data = await this.statisticsService.getCommunitiesCausesByODS(token);

    const supportsByOds = await this.statisticsService.getSupportsByODS(token);

    const supportsByCommunity =
      await this.statisticsService.getSupportsByCommunity(token);

    const actionsProgressByCommunity =
      await this.statisticsService.getActionsProgressByCommunity(token);

    return {
      data: JSON.stringify(data.communitiesByOds),
      supportsByOds: JSON.stringify(supportsByOds.supportPercentageByODS),
      supportsByCommunity: JSON.stringify(
        supportsByCommunity.supportPercentageByCommunity,
      ),
      actionsProgressByCommunity: JSON.stringify(
        actionsProgressByCommunity.actionsProgressByCommunity,
      ),
    };
  }
}
