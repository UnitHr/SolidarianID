import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as joi from 'joi';

const env = dotenv.config({ path: './apps/statistics-ms/.env' });
dotenvExpand.expand(env);

interface EnvVars {
  NODE_ENV: string;
  STATISTICS_MS_HOST: string;
  STATISTICS_MS_PORT: number;
  CASSANDRA_HOST: string;
  CASSANDRA_USER: string;
  CASSANDRA_PASSWORD: string;
  CASSANDRA_CLUSTER_NAME: string;
  CASSANDRA_KEYSPACE: string;
  CASSANDRA_LOCAL_DATA_CENTER: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    STATISTICS_MS_HOST: joi.string().required(),
    STATISTICS_MS_PORT: joi.number().required(),
    CASSANDRA_HOST: joi.string().required(),
    CASSANDRA_USER: joi.string().required(),
    CASSANDRA_PASSWORD: joi.string().required(),
    CASSANDRA_CLUSTER_NAME: joi.string().required(),
    CASSANDRA_KEYSPACE: joi.string().required(),
    CASSANDRA_LOCAL_DATA_CENTER: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  nodeEnv: envVars.NODE_ENV,
  statisticsMsHost: envVars.STATISTICS_MS_HOST,
  statisticsMsPort: envVars.STATISTICS_MS_PORT,
  cassandraHost: envVars.CASSANDRA_HOST,
  cassandraUser: envVars.CASSANDRA_USER,
  cassandraPassword: envVars.CASSANDRA_PASSWORD,
  cassandraClusterName: envVars.CASSANDRA_CLUSTER_NAME,
  cassandraKeyspace: envVars.CASSANDRA_KEYSPACE,
  cassandraLocalDataCenter: envVars.CASSANDRA_LOCAL_DATA_CENTER,
};
