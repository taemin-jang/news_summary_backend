import { Sequelize, DataTypes } from "sequelize";

export default async (db: Sequelize) => {
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

  return articleModel;
};
