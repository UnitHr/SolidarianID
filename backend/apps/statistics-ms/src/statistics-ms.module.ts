import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@common-lib/common-lib/auth/auth.guard';
import { auth } from 'cassandra-driver';
import { CassandraModule } from 'cassandra-for-nest';
import { JwtModule } from '@nestjs/jwt';
import { PlatformStatisticsModule } from './platform-statistics/platform-statistics.module';
import { CommunityReportsModule } from './community-reports/community-reports.module';
import { StatisticsMsEventListenerController } from './statistics-ms.event-listener.controller';
import { envs } from './config';

@Module({
  imports: [
    // Cassandra configuration
    CassandraModule.forRoot({
      contactPoints: [envs.cassandraHost],
      authProvider: new auth.PlainTextAuthProvider(
        envs.cassandraUser,
        envs.cassandraPassword,
      ),
      localDataCenter: envs.cassandraLocalDataCenter,
      keyspace: envs.cassandraKeyspace,
    }),

    // JWT configuration
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),

    // Import modules
    PlatformStatisticsModule,
    CommunityReportsModule,
  ],
  providers: [
    // AuthGuard provider
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [StatisticsMsEventListenerController],
})
export class StatisticsMsModule {}
