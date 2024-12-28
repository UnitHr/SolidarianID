import { v4 as uuidv4 } from 'uuid';
import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id || uuidv4()); // TODO review if this is necessary, ddbb will generate the id
  }
}
