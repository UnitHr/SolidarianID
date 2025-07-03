import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as joi from 'joi';

const env = dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
dotenvExpand.expand(env);

interface EnvVars {
  NODE_ENV: string;
  FRONTEND_HOST: string;
  FRONTEND_PORT: number;
  TOKEN_SECRET: string;
  USER_MS_LOGIN: string;
  USER_MS_BASE_URL: string;
  COMMUNITY_MS_BASE_URL: string;
  STATISTICS_MS_BASE_URL: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    FRONTEND_HOST: joi.string().required(),
    FRONTEND_PORT: joi.number().required(),
    TOKEN_SECRET: joi.string().required(),
    USER_MS_LOGIN: joi.string().required(),
    USER_MS_BASE_URL: joi.string().required(),
    COMMUNITY_MS_BASE_URL: joi.string().required(),
    STATISTICS_MS_BASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  nodeEnv: envVars.NODE_ENV,
  frontendHost: envVars.FRONTEND_HOST,
  frontendPort: envVars.FRONTEND_PORT,
  tokenSecret: envVars.TOKEN_SECRET,
  userMsLogin: envVars.USER_MS_LOGIN,
  userMsBaseUrl: envVars.USER_MS_BASE_URL,
  communityMsBaseUrl: envVars.COMMUNITY_MS_BASE_URL,
  statisticsMsBaseUrl: envVars.STATISTICS_MS_BASE_URL,
};
