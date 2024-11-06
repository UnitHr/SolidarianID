import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/persistence/Usuario';
import { UsuariosModule } from 'src/modules/usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    autoLoadEntities: true,
    migrations: [],
    subscribers: []
  }), 
  TypeOrmModule.forFeature([Usuario]), 
  UsuariosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//voy por el min 33 de la primera grabación de la clase 4