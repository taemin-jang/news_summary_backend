import loaders from "@loaders";
import express, { Application } from "express";
import config from "@config";
import Container from "typedi";
import { Logger } from "winston";
import cors from "cors";

async function startServer() {
  const app: Application = express();

  const corsOptions = {
    origin: "http://localhost:5173",
  };
  // CORS 미들웨어 사용
  app.use(cors(corsOptions));

  // loaders로 로직 분리
  await loaders(app);

  // log 관리하는 logger 생성
  const logger: Logger = Container.get("logger");

  app.listen(config.port, () => {
    logger.info("실행되었습니다. http://localhost:3000");
  });
}

startServer();
