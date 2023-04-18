import { Sequelize } from "sequelize";
import config from "@config";
import LoggerInstance from "./logger";

export default async () => {
  const sequelizeInstance = new Sequelize(config.db, {
    logging: (msg) => LoggerInstance.debug(msg),
    timezone: "+09:00", // mysql2는 timezone : "Asia/Seoul"을 지원 안하므로 변경해줘야함
  });

  await sequelizeInstance.authenticate(); // 접속 대기
  return sequelizeInstance;
};
