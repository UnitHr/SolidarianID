import { Injectable } from '@nestjs/common';
import * as hbs from 'hbs';

@Injectable()
export class HandlebarsHelpersService {
  constructor() {
    // equal helper
    hbs.registerHelper('eq', function (v1, v2) {
      return v1 === v2;
    });

    // and helper
    hbs.registerHelper('and', function (v1, v2) {
      return v1 && v2;
    });

    hbs.registerHelper('or', function (v1, v2) {
      return v1 || v2;
    });

    hbs.registerHelper('not', function (v1) {
      return !v1;
    });

    hbs.registerHelper('inc', (value) => parseInt(value) + 1);
    hbs.registerHelper('dec', (value) => parseInt(value) - 1);
    hbs.registerHelper('gt', (a, b) => a > b);
    hbs.registerHelper('lt', (a, b) => a < b);
  }
}
