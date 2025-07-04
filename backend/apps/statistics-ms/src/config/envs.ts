import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as joi from 'joi';

const env = dotenv.config({
  path: `./apps/statistics-ms/.env.${process.env.NODE_ENV}`,
});
dotenvExpand.expand(env);

interface EnvVars {
  NODE_ENV: string;
  STATISTICS_MS_HOST: string;
  STATISTICS_MS_PORT: number;
  KAFKA_BROKERS: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_GROUP_ID: string;
  KAFKA_TOPIC_COMMUNITIES: string;
  CASSANDRA_HOST: string;
  CASSANDRA_USER: string;
  CASSANDRA_PASSWORD: string;
  CASSANDRA_CLUSTER_NAME: string;
  CASSANDRA_KEYSPACE: string;
  CASSANDRA_LOCAL_DATA_CENTER: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    STATISTICS_MS_HOST: joi.string().required(),
    STATISTICS_MS_PORT: joi.number().required(),
    KAFKA_BROKERS: joi.string().required(),
    KAFKA_CLIENT_ID: joi.string().required(),
    KAFKA_GROUP_ID: joi.string().required(),
    KAFKA_TOPIC_COMMUNITIES: joi.string().required(),
    CASSANDRA_HOST: joi.string().required(),
    CASSANDRA_USER: joi.string().required(),
    CASSANDRA_PASSWORD: joi.string().required(),
    CASSANDRA_CLUSTER_NAME: joi.string().required(),
    CASSANDRA_KEYSPACE: joi.string().required(),
    CASSANDRA_LOCAL_DATA_CENTER: joi.string().required(),
    JWT_SECRET: joi.string().required(),
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
  kafkaBrokers: envVars.KAFKA_BROKERS.split(','),
  kafkaClientId: envVars.KAFKA_CLIENT_ID,
  kafkaGroupId: envVars.KAFKA_GROUP_ID,
  kafkaTopicCommunities: envVars.KAFKA_TOPIC_COMMUNITIES,
  cassandraHost: envVars.CASSANDRA_HOST,
  cassandraUser: envVars.CASSANDRA_USER,
  cassandraPassword: envVars.CASSANDRA_PASSWORD,
  cassandraClusterName: envVars.CASSANDRA_CLUSTER_NAME,
  cassandraKeyspace: envVars.CASSANDRA_KEYSPACE,
  cassandraLocalDataCenter: envVars.CASSANDRA_LOCAL_DATA_CENTER,
  jwtSecret: envVars.JWT_SECRET,
};
