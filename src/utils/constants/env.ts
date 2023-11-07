const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT ?? 8000,
  deployedFEUrl: process.env.DEPLOYED_FE_URL ?? "http://localhost:3000/",
  dbHost: process.env.HOST ?? "localhost",
  dbPort: process.env.DB_PORT ?? 5432,
  dbUsername: process.env.DB_USERNAME ?? "postgres",
  dbPassword: process.env.DB_PASSWORD ?? "solicy123",
  dbName: process.env.DB_NAME ?? "test3",
  jwtSecretKey: process.env.JWT_SECRET_KEY ?? "your-secret-key",
  refreshSecretKey: process.env.REFRESH_SECRET_KEY ?? "your-secret-key-a",
};

export default env;
