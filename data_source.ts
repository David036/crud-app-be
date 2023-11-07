import { DataSource } from "typeorm";
import env from "./src/utils/constants/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.dbHost,
  port: +env.dbPort,
  username: env.dbUsername,
  password: env.dbPassword,
  database: env.dbName,
  synchronize: false,
  ssl: true,
  logging: false,
  migrations: ["src/migrations/*.ts"],
  entities: ["src/entities/*.ts"],
});
