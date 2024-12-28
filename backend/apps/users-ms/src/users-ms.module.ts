import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';

@Module({
  imports: [
    // TypeORM for PostgreSQL configuration
    TypeOrmModule.forRootAsync({
      // Configuation from .env
      useFactory: () => ({
        type: 'postgres',
        host: envs.postgresHost,
        port: envs.postgresPort,
        username: envs.postgresUser,
        password: envs.postgresPassword,
        database: envs.postgresDb,
        autoLoadEntities: true, // Automatically load all entities
        synchronize: true, // Only for development; not for production
        logging: false,
        migrations: [],
        subscribers: [],
      }),
    }),
    UserModule,
    AuthModule,
  ],
})
export class UsersMsModule {}
