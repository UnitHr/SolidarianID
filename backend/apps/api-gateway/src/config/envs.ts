import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as joi from 'joi';

const env = dotenv.config({
  path: `./apps/api-gateway/.env.${process.env.NODE_ENV}`,
});
dotenvExpand.expand(env);

interface EnvVars {
  NODE_ENV: string;
  API_GATEWAY_HOST: string;
  API_GATEWAY_PORT: number;
  USERS_MS_URL: string;
  COMMUNITIES_MS_URL: string;
  STATISTICS_MS_URL: string;
  COMMUNITIES_DOCS_URL: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    API_GATEWAY_HOST: joi.string().required(),
    API_GATEWAY_PORT: joi.number().required(),
    USERS_MS_URL: joi.string().required(),
    COMMUNITIES_MS_URL: joi.string().required(),
    STATISTICS_MS_URL: joi.string().required(),
    COMMUNITIES_DOCS_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  nodeEnv: envVars.NODE_ENV,
  apiGatewayHost: envVars.API_GATEWAY_HOST,
  apiGatewayPort: envVars.API_GATEWAY_PORT,
  usersMsUrl: envVars.USERS_MS_URL,
  communitiesMsUrl: envVars.COMMUNITIES_MS_URL,
  statisticsMsUrl: envVars.STATISTICS_MS_URL,
  communitiesDocsUrl: envVars.COMMUNITIES_DOCS_URL,
};
