import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as joi from 'joi';

const env = dotenv.config({
  path: `./apps/users-ms/.env.${process.env.NODE_ENV}`,
});
dotenvExpand.expand(env);

interface EnvVars {
  NODE_ENV: string;
  USERS_MS_HOST: string;
  USERS_MS_PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  JWT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_BROKERS: string;
  KAFKA_GROUP_ID: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  PUSH_SERVER_URL: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    USERS_MS_HOST: joi.string().required(),
    USERS_MS_PORT: joi.number().required(),
    POSTGRES_HOST: joi.string().required(),
    POSTGRES_PORT: joi.number().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    GITHUB_CLIENT_ID: joi.string().required(),
    GITHUB_CLIENT_SECRET: joi.string().required(),
    GITHUB_CALLBACK_URL: joi.string().required(),
    KAFKA_CLIENT_ID: joi.string().required(),
    KAFKA_BROKERS: joi.string().required(),
    KAFKA_GROUP_ID: joi.string().required(),
    ADMIN_EMAIL: joi.string().required(),
    ADMIN_PASSWORD: joi.string().required(),
    PUSH_SERVER_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  nodeEnv: envVars.NODE_ENV,
  usersMsHost: envVars.USERS_MS_HOST,
  usersMsPort: envVars.USERS_MS_PORT,
  postgresHost: envVars.POSTGRES_HOST,
  postgresPort: envVars.POSTGRES_PORT,
  postgresUser: envVars.POSTGRES_USER,
  postgresPassword: envVars.POSTGRES_PASSWORD,
  postgresDb: envVars.POSTGRES_DB,
  jwtSecret: envVars.JWT_SECRET,
  githubClientId: envVars.GITHUB_CLIENT_ID,
  githubClientSecret: envVars.GITHUB_CLIENT_SECRET,
  githubCallbackUrl: envVars.GITHUB_CALLBACK_URL,
  kafkaClientId: process.env.KAFKA_CLIENT_ID,
  kafkaBrokers: process.env.KAFKA_BROKERS.split(','),
  kafkaGroupId: process.env.KAFKA_GROUP_ID,
  adminEmail: envVars.ADMIN_EMAIL,
  adminPassword: envVars.ADMIN_PASSWORD,
  pushServerUrl: envVars.PUSH_SERVER_URL,
};
