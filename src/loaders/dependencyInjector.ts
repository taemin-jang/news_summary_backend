import { Sequelize } from "sequelize";
import { Container } from "typedi";
import LoggerInstance from "./logger";
import sequelizeInstance from "./sequelize";

export default async (sequelizeInstance: Sequelize) => {
  // logger 의존성 설정
  Container.set("logger", LoggerInstance);

  // db 의존성 설정
  Container.set("db", sequelizeInstance);
};
