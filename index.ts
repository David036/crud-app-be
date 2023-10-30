import express from "express";
import cors from "cors";
import { AppDataSource } from "./data_source";
import Routes from "./src/routes";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
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
