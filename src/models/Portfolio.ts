import { Sequelize, DataTypes, ModelCtor } from "sequelize";

export default async (
  db: Sequelize,
  KakaoModel: ModelCtor<any>,
  StockModel: ModelCtor<any>
) => {
  // portfolio 모델
  const portfolioModel = db.define(
    "Portfolio",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

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

  return portfolioModel;
};
