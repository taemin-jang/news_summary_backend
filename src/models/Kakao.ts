import { Sequelize, DataTypes } from "sequelize";

export default async (db: Sequelize) => {
  // kakao 모델
  const kakaoModel = db.define(
    "Kakao",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      nickname: {
        type: DataTypes.STRING,
      },
      profile_image: {
        type: DataTypes.STRING,
      },
      thumbnail_image: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );

  return kakaoModel;
};
