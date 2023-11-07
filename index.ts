import express from "express";
import cors from "cors";
import { AppDataSource } from "./data_source";
import Routes from "./src/routes";
import env from "./src/utils/constants/env";
import cookieParser from "cookie-parser";

const app = express();
const PORT = env.port;

app.use(
  cors({
    origin: env.deployedFEUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(cookieParser());
app.use(Routes);

const start = async () => {
  await AppDataSource.initialize();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
