import Kakao from "@models/Kakao";
import Stock from "@models/Stock";
import { Sequelize } from "sequelize";

export default async (db: Sequelize) => {
  const kakaoModel = Kakao(db);
  const StockModel = Stock(db);
  await db.sync();
};
