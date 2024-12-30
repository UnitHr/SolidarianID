import { Injectable } from '@nestjs/common';
import * as hbs from 'hbs';

@Injectable()
export class HandlebarsHelpersService {
  constructor() {
    // Registrar el helper de comparación "eq"
    hbs.registerHelper('eq', function (v1, v2) {
      return v1 === v2;
    });
  }
}
