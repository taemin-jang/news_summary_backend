import Kakao from "@models/Kakao";
import Stock from "@models/Stock";
import Portfolio from "@models/Portfolio";
import Article from "@models/Article";
import { Sequelize } from "sequelize";

export default async (db: Sequelize) => {
  const KakaoModel = await Kakao(db);
  const StockModel = await Stock(db);
  const PortfolioModel = await Portfolio(db);
  const ArticleModel = await Article(db);
  await db.sync();
};
