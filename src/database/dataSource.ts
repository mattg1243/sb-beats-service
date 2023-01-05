import { DataSource } from 'typeorm';
import Beat from './models/Beat.entity';
import dotenv from 'dotenv';

dotenv.config();

// load in db credentials and connection string
const DB_URL = process.env.DB_URL;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DB_URL,
  port: 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: 'sweatshop_calabasas',
  synchronize: true,
  logging: false,
  entities: [Beat],
  subscribers: [],
  migrations: [],
  ssl: true,
});
