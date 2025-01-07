import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { ValidationService } from './validation.service';
import { HandlebarsHelpersService } from 'src/helper.service';
import { ModuleTokenFactory } from '@nestjs/core/injector/module-token-factory';

@Controller('validation')
export class ValidationController {
  constructor(
    private readonly validationService: ValidationService,
    private readonly handlebarsHelpersService: HandlebarsHelpersService,
  ) {}

  @Get()
  @Render('platform-admin/validation')
  async getValidation(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req,
    @Res() res,
  ) {
    // check if user is authenticated
    const user = req.cookies.user;
    if (!user) {
      res.redirect('/login');
    }

    try {
      const { data, pagination } =
        await this.validationService.getCreateCommunityRequests(
          page,
          limit,
          user.token,
        );

      return {
        user: user,
        activePage: 'adminDashboard',
        title: 'Validations',
        requests: data,
        pagination: {
          currentPage: page,
          totalPages: pagination.totalPages,
          hasPrevious: page > 1,
          hasNext: page < pagination.totalPages,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page < pagination.totalPages ? +page + 1 : null,
          pages: Array.from({ length: pagination.totalPages }, (_, i) => i + 1),
        },
      };
    } catch (error) {
      console.error('Error fetching community requests:', error);
      return {
        user: user,
        requests: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false,
          previousPage: null,
          nextPage: null,
          pages: [],
        },
      };
    }
  }

  @Post('/validate')
  async validateRequests(
    @Req() req,
    @Res() res,
    @Body() body: { selectedRequests: string },
  ) {
    const user = req.cookies.user;

    if (!user) {
      return res.redirect('/login');
    }

    try {
      await this.validationService.validateRequests(
        body.selectedRequests,
        user.token,
      );

      return res.redirect('/validation');
    } catch (error) {
      console.error('Error validating requests:', error);
      return res.status(500).json({
        success: false,
        message:
          'There was an error processing the validation of the requests.',
      });
    }
  }

  @Post('/reject/:id')
  async rejectRequest(
    @Req() req,
    @Res() res,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    const user = req.cookies.user;
    if (!user) {
      res.redirect('/login');
    }
    try {
      await this.validationService.rejectRequest(id, reason, user.token);

      return res.redirect('/validation');
    } catch (error) {
      console.error('Error validating requests:', error);
      return res.status(500).json({
        success: false,
        message:
          'There was an error processing the validation of the requests.',
      });
    }
  }
}
