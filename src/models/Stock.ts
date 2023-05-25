import { Sequelize, DataTypes } from "sequelize";

export default async (db: Sequelize) => {
  // stock 모델
  const stockModel = db.define(
    "Stock",
    {
      itmsNm: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      srtnCd: {
        type: DataTypes.STRING,
      },
      mrktCtg: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );

  return stockModel;
};
