import { Sequelize } from "sequelize";
import { Container } from "typedi";
import LoggerInstance from "./logger";
import SessionInstance from "./session";
import models from "@models/index";
import Kakao from "@models/Kakao";

// typedi의 Container에 등록
export default async (sequelizeInstance: Sequelize) => {
  // logger 의존성 설정
  Container.set("logger", LoggerInstance);

  // db 의존성 설정
  Container.set("db", sequelizeInstance);

  // session 의존성 설정
  Container.set("session", SessionInstance);

  // 테이블 생성
  models(sequelizeInstance);

  Container.set("kakaoModel", Kakao(sequelizeInstance));
};
