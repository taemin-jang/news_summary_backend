import { Sequelize, DataTypes, ModelCtor } from "sequelize";

export default async (db: Sequelize) => {
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

  return portfolioModel;
};
