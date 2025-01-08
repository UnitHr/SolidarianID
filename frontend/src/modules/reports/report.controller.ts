import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
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

    try {
      const communities = await this.reportService.getCommunities(user.token);
      console.log(communities);
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

  @Post('')
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
  }

  @Post('/generate')
  async generateReport(@Body() body: any, @Res() res: Response) {
    const { communityDetails, includeGraphics } = body;
  }
}
