import { Sequelize, DataTypes } from "sequelize";
import Stock from "@models/Stock";

export default async (db: Sequelize) => {
  const StockModel = await Stock(db);

  const articleModel = db.define(
    "Article",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
      },
      link: {
        type: DataTypes.STRING,
      },
      summary: {
        type: DataTypes.TEXT,
      },
      pubDate: {
        type: DataTypes.STRING,
      },
      keywords: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
          const value = this.getDataValue("keywords");
          return JSON.parse(value);
        },
        set(value: string[]) {
          this.setDataValue("keywords", JSON.stringify(value));
        },
      },
      images: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
          const value = this.getDataValue("images");
          return JSON.parse(value);
        },
        set(value: string[]) {
          this.setDataValue("images", JSON.stringify(value));
        },
      },
    },
    { timestamps: false }
  );

  // 뉴스 기사 : 주식(회사) = 1 : N 관계
  // 뉴스 기사는 하나의 주식(회사)에 속함
  articleModel.belongsTo(StockModel, {
    foreignKey: "stock_id",
  });
  // 주식(회사)는 여러 개의 뉴스 기사를 가질 수 있음
  StockModel.hasMany(articleModel, {
    foreignKey: "stock_id",
  });

  return articleModel;
};
