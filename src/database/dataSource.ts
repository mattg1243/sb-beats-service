import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'sweatshop_calabasas',
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
  ssl: true,
});
