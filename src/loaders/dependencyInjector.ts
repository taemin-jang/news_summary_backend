import { Sequelize } from "sequelize";
import { Container } from "typedi";
import LoggerInstance from "./logger";

// typedi의 Container에 등록
export default async (sequelizeInstance: Sequelize) => {
  // logger 의존성 설정
  Container.set("logger", LoggerInstance);

  // db 의존성 설정
  Container.set("db", sequelizeInstance);
};
