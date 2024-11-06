import { Injectable } from '@nestjs/common';
import { Usuario } from '../usuarios/persistence/Usuario';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Usuario)
    private usersRepository: Repository<Usuario>,
  ){}
  

  //async porque find devuelve una promesa
  async getUsers() {
    //no hace falta poner await en los return
    return this.usersRepository.find();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
