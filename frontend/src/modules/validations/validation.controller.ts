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
  async getValidation(@Query('page') page = 1, @Req() req, @Res() res) {
    // check if user is authenticated
    const user = req.cookies.user;
    if (!user) {
      res.redirect('/login');
    }
    // Pagination: 10 items per page
    const offset = (page - 1) * 10;
    const limit = 10;
    const results = await this.validationService.getCreateCommunityRequests(
      offset,
      limit,
      user.token,
    );

    return {
      user: user,
      title: 'Validation',
      activePage: 'adminDashboard',
      requests: results.data,
      page,
      totalPages: Math.ceil(results.total / limit),
    };
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
