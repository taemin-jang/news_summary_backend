import axios, { AxiosResponse } from "axios";
import Container from "typedi";
import { Logger, loggers } from "winston";
import { ModelCtor, Sequelize } from "sequelize";
import config from "@config";
import moment from "moment";
import { StockResponse } from "../types/StockResponse";

export default class StockService {
  stockModel: ModelCtor<any>;
  constructor() {
    const db: Sequelize = Container.get("db");
    const data = moment();
    this.stockModel = db.models.Stock;
  }

  // 키워드로 주식 정보 반환
  public async getStock(keyword: string) {
    const stockItem: AxiosResponse = await axios.get(
      `${config.stock_base_url}/getStockPriceInfo?serviceKey=${config.stock_service_key}&basDt=20230523&itmsNm=${keyword}&numOfRows=10&resultType=json`
    );
    let stock = await this.stockModel.findAll();

    // 만약 주식 리스트가 하나도 없다면 리스트 저장
    if (!stock.length) {
      const response: AxiosResponse = await axios.get(
        `${config.stock_base_url}/getStockPriceInfo?serviceKey=${config.stock_service_key}&basDt=20230523&numOfRows=2716&resultType=json`
      );
      this.registStock(response.data.response.body.items.item);
    }
    return stockItem;
  }

  // 데이터베이스에 stock 등록
  public registStock(stockArr: Array<StockResponse>) {
    try {
      stockArr.forEach(async (v) => {
        await this.stockModel.create({
          itmsNm: v.itmsNm,
          srtnCd: v.srtnCd,
          mrktCtg: v.mrktCtg,
        });
      });
    } catch (err) {
      const logger: Logger = Container.get("logger");
      logger.error(err);
    }
  }
}
