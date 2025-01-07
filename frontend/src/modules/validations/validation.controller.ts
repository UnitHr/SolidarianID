import { Controller, Get, Query, Render, Req, Res } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { HandlebarsHelpersService } from 'src/helper.service';

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

  // Endpoint para validar varias solicitudes seleccionadas
  /*
  @Post('validate-requests')
  async validateRequests(
    @Body() body: { requestIds: string[] }, // Lista de IDs de las solicitudes a validar
    @Res() res: Response,
  ) {
    try {
      const result = await this.appService.validateRequests(body.requestIds);
      //return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al validar las solicitudes' });
    }
  }

  // Endpoint para rechazar una solicitud
  @Post('reject-request/:id')
  async rejectRequest(
    @Param('id') requestId: string, 
    @Body() body: { reason: string }, 
    @Res() res: Response,
  ) {
    try {
      const result = await this.appService.rejectRequest(
        requestId,
        body.reason,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al rechazar la solicitud' });
    }
  }
  */
}
