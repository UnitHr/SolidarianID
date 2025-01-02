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
  }
}
