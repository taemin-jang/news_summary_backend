import Kakao from "@models/Kakao";
import { Sequelize } from "sequelize";

export default async (db: Sequelize) => {
  const kakaoModel = Kakao(db);

  await db.sync();
};
