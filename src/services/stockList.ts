import axios, { AxiosResponse } from "axios";
import Container from "typedi";
import { Logger } from "winston";
import { ModelCtor, Sequelize } from "sequelize";
import config from "@config";
import moment, { Moment } from "moment";
import { StockResponse, StockModel } from "../types/StockResponse";

export default class StockService {
  stockModel: ModelCtor<any>;
  currentDate: Moment;
  stockLatestDay: string;
  constructor() {
    const db: Sequelize = Container.get("db");
    this.stockModel = db.models.Stock;
    this.currentDate = moment().add(-2, "days");
    this.stockLatestDay = this.currentDate.format("YYYYMMDD");
    this.getNextWeekay();
  }

  /**
   * 주말과, 공휴일, 금일을 제외한 주식 마지막 마감장 구하는 함수
   */
  public async getNextWeekay() {
    // 공휴일 정보 데이터
    const responose = await axios.get(
      "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getAnniversaryInfo?ServiceKey=lXqTdD113aOJgHxnZE4A28dqA7IsAdMunvy6i7P%2Bln7dzu0l81cUpoVTrEebSDTHxknEqL%2F%2FJ%2BMwyx%2BZHxAJ4A%3D%3D&pageNo=1&numOfRows=100&solYear=2023"
    );

    // 공휴일을 key와 value값으로 저장
    const publicHolidays = responose.data.response.body.items.item.reduce(
      (map, obj) => map.set(obj.locdate, obj.dateName),
      new Map()
    );
    // 공휴일이거나 주말 (0 => 일, 토 => 6)일이 아닐때까지
    while (
      publicHolidays.get(+this.currentDate.format("YYYYMMDD")) ||
      this.currentDate.day() === 0 ||
      this.currentDate.day() === 6
    ) {
      this.currentDate = this.currentDate.add(-1, "days");
    }
    this.stockLatestDay = this.currentDate.format("YYYYMMDD");
  }

  /**
   * 키워드로 주식 정보 반환하는 함수
   * @param keyword string, 검색할 주식 명
   * @returns stockItem 주식 정보
   */
  public async getStock(keyword: string): Promise<AxiosResponse> {
    const stockItem: AxiosResponse = await axios.get(
      `${config.stock_base_url}/getStockPriceInfo?serviceKey=${config.stock_service_key}&basDt=${this.stockLatestDay}&itmsNm=${keyword}&numOfRows=10&resultType=json`
    );
    return stockItem;
  }

  /**
   * 상장된 주식 리스트를 반환하는 함수
   * @returns stock 주식 리스트
   */
  public async getAllStock(): Promise<StockModel[]> {
    let stock: StockModel[] = await this.stockModel.findAll();

    // 만약 주식 리스트가 하나도 없다면 리스트 저장
    if (!stock.length) {
      const response: AxiosResponse = await axios.get(
        `${config.stock_base_url}/getStockPriceInfo?serviceKey=${config.stock_service_key}&basDt=20230523&numOfRows=2716&resultType=json`
      );
      await this.registStock(response.data.response.body.items.item);
      stock = await this.stockModel.findAll();
    }
    return stock;
  }

  /**
   * stocks 테이블에 주식 등록하는 함수
   * @param stockArr api로 받아온 주식 정보
   */
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
