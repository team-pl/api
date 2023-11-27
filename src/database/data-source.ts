import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  entities: ['src/entity/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
