import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as joi from 'joi';

const env = dotenv.config({
  path: `.env`,
});
dotenvExpand.expand(env);

interface EnvVars {
  NODE_ENV: string;
  FRONTEND_HOST: string;
  FRONTEND_PORT: number;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    FRONTEND_HOST: joi.string().required(),
    FRONTEND_PORT: joi.number().required(),
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
};
