import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { envs } from './config';
import { HistoryModule } from './history/history.module';

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

    // Import modules
    UserModule,
    AuthModule,
    HistoryModule,
  ],
})
export class UsersMsModule {}
