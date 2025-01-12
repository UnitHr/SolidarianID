import { Injectable } from '@nestjs/common';
import * as hbs from 'hbs';

@Injectable()
export class HandlebarsHelpersService {
  constructor() {
    // Equal helper
    hbs.registerHelper('eq', function (v1, v2) {
      return v1 === v2;
    });

    hbs.registerHelper('not', function (v1) {
      return !v1;
    });

    hbs.registerHelper('formatDate', function (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}/${month}/${day}`;
    });
  }
}
