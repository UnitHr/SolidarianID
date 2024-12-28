import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  NODE_ENV: string;
  COMMUNITIES_MS_PORT: number;
  MONGO_HOST: string;
  MONGO_PORT: number;
  MONGO_DB: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    COMMUNITIES_MS_PORT: joi.number().required(),
    MONGO_HOST: joi.string().required(),
    MONGO_PORT: joi.number().required(),
    MONGO_DB: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  nodeEnv: envVars.NODE_ENV,
  communitiesMsPort: envVars.COMMUNITIES_MS_PORT,
  mongoHost: envVars.MONGO_HOST,
  mongoPort: envVars.MONGO_PORT,
  mongoDb: envVars.MONGO_DB,
};
