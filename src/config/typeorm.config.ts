import { DataSource, DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.DB_TEST_NAME
      : process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'production' ? true : false,
  logging: process.env.NODE_ENV !== 'production' ? true : false,
};

export const typeOrmConfig = new DataSource(config);