import convict, { type SchemaObj } from 'convict';
import dotenv from 'dotenv';

// Load .env file into process.env
dotenv.config();

type ConvictSchema<T> = {
  [K in keyof T]: SchemaObj<T[K]>;
};

interface BaseConfig {
  NODE_ENV: string;
}

const BASE_SCHEMA: ConvictSchema<BaseConfig> = {
  NODE_ENV: {
    doc: 'Node environment',
    format: ['development', 'production', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
};

export const createConfig = <T>(
  schema: ConvictSchema<T>
): (<K extends keyof (T & BaseConfig)>(key: K) => (T & BaseConfig)[K]) => {
  const mergedSchema = { ...BASE_SCHEMA, ...schema } as ConvictSchema<
    T & BaseConfig
  >;

  // Create and validate the config
  const configInstance = convict<T & BaseConfig>(mergedSchema);
  configInstance.validate({ allowed: 'strict' });

  // Cache the validated config
  const config = configInstance.getProperties();

  // Return a getter function that takes a key
  return <K extends keyof (T & BaseConfig)>(key: K): (T & BaseConfig)[K] =>
    config[key];
};
