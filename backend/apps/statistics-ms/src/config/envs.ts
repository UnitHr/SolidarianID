import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as joi from 'joi';

const env = dotenv.config({ path: './apps/statistics-ms/.env' });
dotenvExpand.expand(env);

interface EnvVars {
  NODE_ENV: string;
  STATISTICS_MS_HOST: string;
  STATISTICS_MS_PORT: number;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    STATISTICS_MS_HOST: joi.string().required(),
    STATISTICS_MS_PORT: joi.number().required(),
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
};
