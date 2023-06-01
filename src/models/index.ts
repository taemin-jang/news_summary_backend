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

  // KakaoModel : StockModel = N : M 관계 설정
  KakaoModel.belongsToMany(StockModel, {
    through: {
      model: "Portfolio",
      unique: false, // 중복 관계 허용
    },
    foreignKey: "kakao_id",
  });

  StockModel.belongsToMany(KakaoModel, {
    through: {
      model: "Portfolio",
      unique: false, // 중복 관계 허용
    },
    foreignKey: "stock_id",
  });

  // 주식(회사) : 뉴스 기사 = 1 : N 관계
  // 주식(회사)는 여러 개의 뉴스 기사를 가질 수 있음
  StockModel.hasMany(ArticleModel, {
    foreignKey: "stock_id",
  });
  // 뉴스 기사는 하나의 주식(회사)에 속함
  ArticleModel.belongsTo(StockModel, {
    foreignKey: "stock_id",
  });

  // Portfolio : ArticleModel = 1 : N 관계 설정
  PortfolioModel.hasMany(ArticleModel, {
    as: "article",
    foreignKey: "stock_id",
    sourceKey: "stock_id",
  });

  ArticleModel.belongsTo(PortfolioModel, {
    foreignKey: "stock_id",
    targetKey: "stock_id",
  });
  await db.sync({ alter: true });
};
