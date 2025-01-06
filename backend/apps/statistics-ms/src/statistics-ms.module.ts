import { Module } from '@nestjs/common';
import { auth } from 'cassandra-driver';
import { CassandraModule } from 'cassandra-for-nest';
import { PlatformStatisticsModule } from './platform-statistics/platform-statistics.module';
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
      socketOptions: {
        readTimeout: 30000, // Aumenta el timeout de lectura (en milisegundos)
        connectTimeout: 5000, // Aumenta el timeout de conexión (en milisegundos)
      },
    }),

    // Import modules
    PlatformStatisticsModule,
  ],
})
export class StatisticsMsModule {}
