import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as joi from 'joi';

const env = dotenv.config({ path: './apps/communities-ms/.env' });
dotenvExpand.expand(env);

interface EnvVars {
  NODE_ENV: string;
  COMMUNITIES_MS_HOST: string;
  COMMUNITIES_MS_PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    COMMUNITIES_MS_HOST: joi.string().required(),
    COMMUNITIES_MS_PORT: joi.number().required(),
    MONGO_URI: joi.string().required(),
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
  communitiesMsHost: envVars.COMMUNITIES_MS_HOST,
  communitiesMsPort: envVars.COMMUNITIES_MS_PORT,
  mongoUri: envVars.MONGO_URI,
  jwtSecret: envVars.JWT_SECRET,
};
