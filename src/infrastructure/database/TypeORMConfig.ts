import { DataSource } from 'typeorm';
import { TaskOrmEntity } from './entities/TaskOrmEntity';
import config from '../../../server_config.json';

export const cleanDataSource = new DataSource({
  type: 'postgres',
  host: config.db_config.host,
  port: config.db_config.port,
  username: config.db_config.username,
  password: config.db_config.password,
  database: config.db_config.dbname,
  entities: [TaskOrmEntity],
  synchronize: true,
  logging: false
});
