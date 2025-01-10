import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { StatisticsService } from '../statistics/statistic.service';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Get('')
  @Render('platform-admin/selectCommunity')
  async getReports(@Req() req, @Res() res) {
    const user = req.cookies.user;
    if (!user) {
      return res.redirect('/login');
    }
    if (user.roles !== 'admin') {
      return res
        .status(403)
        .json({ message: 'You do not have permission to access this route' });
    }

    try {
      const communities = await this.reportService.getCommunities(user.token);
      return {
        user: user,
        communities: communities,
        title: 'Reports',
        activePage: 'adminDashboard',
      };
    } catch (error) {
      console.error('Error fetching communities:', error);
      return {
        user: user,
        communities: [],
        title: 'Reports',
        activePage: 'adminDashboard',
      };
    }
  }

  @Post()
  @Render('platform-admin/communityDetails')
  async getCommunityDetails(
    @Req() req,
    @Res() res,
    @Body() body: { communityId: string },
  ) {
    const user = req.cookies.user;

    if (!user) {
      return res.redirect('/login');
    }
    try {
      const community = await this.reportService.getCommunityDetails(
        user.token,
        body.communityId,
      );

      const datasByOds = await this.statisticsService.getDataByODS(user.token);

      const datasByCommunity = await this.statisticsService.getDataByCommunity(
        user.token,
      );
      return {
        user: user,
        title: 'Reports',
        activePage: 'adminDashboard',
        community: community,
        datasByOds: JSON.stringify(datasByOds),
        datasByCommunity: JSON.stringify(datasByCommunity),
      };
    } catch (error) {
      console.error('Error fetching community details:', error);
      return {
        user: user,
        title: 'Reports',
        activePage: 'adminDashboard',
        community: {},
        datasByOds: JSON.stringify([]),
        datasByCommunity: JSON.stringify([]),
      };
    }
  }
}
