import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "solicy123",
  database: "test3",
  synchronize: false,
  logging: false,
  migrations: ["src/migrations/*.ts"],
  entities: ["src/entities/*.ts"],
});
