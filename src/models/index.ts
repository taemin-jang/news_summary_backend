import Kakao from "@models/Kakao";
import Stock from "@models/Stock";
import Portfolio from "@models/Portfolio";
import { Sequelize } from "sequelize";

export default async (db: Sequelize) => {
  const KakaoModel = await Kakao(db);
  const StockModel = await Stock(db);
  const PortfolioModel = await Portfolio(db, KakaoModel, StockModel);
  await db.sync();
};
