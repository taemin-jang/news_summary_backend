import axios, { AxiosResponse } from "axios";
import Container from "typedi";
import { Logger } from "winston";
import { ModelCtor, Sequelize } from "sequelize";
import config from "@config";
import moment, { Moment } from "moment";
import { StockResponse, StockModel } from "../types/StockResponse";
import { PortfolioModel } from "../types/PortfolioResponse";
import { registPortfolioToArticle } from "@services/articleURL";

export default class StockService {
  stockModel: ModelCtor<any>;
  portfolioModel;
  currentDate: Moment;
  stockLatestDay: string;
  logger: Logger;
  constructor() {
    this.logger = Container.get("logger");
    const db: Sequelize = Container.get("db");
    this.stockModel = db.models.Stock;
    this.portfolioModel = db.models;
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
  public async getStock(
    keyword: string,
    userId: number
  ): Promise<AxiosResponse> {
    const stockItemPromise = axios.get(
      `${config.stock_base_url}/getStockPriceInfo?serviceKey=${config.stock_service_key}&itmsNm=${keyword}&numOfRows=1&resultType=json`
    );
    const portfolioPromise = this.portfolioModel.Portfolio.findOrCreate({
      where: { stock_id: keyword, kakao_id: userId },
    });
    const registPortfolioPromise = registPortfolioToArticle(keyword);

    const [stockItem] = await Promise.all([
      stockItemPromise,
      portfolioPromise,
      registPortfolioPromise,
    ]);
    console.log(stockItem);
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

  /**
   * kakao_id 값으로 등록된 portfolio 주식 리스트 반환하는 함수
   * @param userId number, kakao_id
   * @returns portfolio
   */
  public async getPortfolio(userId: number): Promise<PortfolioModel[]> {
    const portfolio: PortfolioModel[] =
      await this.portfolioModel.Portfolio.findAll({
        where: {
          kakao_id: userId,
        },
      });
    return portfolio;
  }

  /**
   * 포트폴리오 테이블에 등록된 주식에 대한 최신 정보를 반환하는 함수
   * @param portfolio
   * @returns
   */
  public async getRegistedStockInfo(
    portfolios: PortfolioModel[]
  ): Promise<PortfolioModel[]> {
    // axios.get 요청할 작업들을 저장하는 배열
    const tasks = portfolios.map((portfolio) => {
      return axios
        .get(
          `${config.stock_base_url}/getStockPriceInfo?serviceKey=${config.stock_service_key}&itmsNm=${portfolio.stock_id}&numOfRows=5&resultType=json`
        )
        .then((response) => {
          return {
            id: portfolio.id,
            data: response.data.response.body.items.item[0],
            datas: response.data.response.body.items.item,
          };
        });
    });
    try {
      // 여기서 responses는 각 요청에 대한 결과를 포함한 배열
      const responses = await Promise.all(tasks);
      return responses.map((response) => {
        return {
          id: response.id,
          datas: response.datas,
          ...response.data,
        };
      });
    } catch (error) {
      this.logger.error("Error: ", error);
      return [];
    }
  }

  /**
   * 포트폴리오에 등록된 주식 삭제하는 함수
   * @param keyword 삭제할 주식명
   * @param userId 삭제하는 사용자
   */
  public async deleteStock(keyword: string, userId: number) {
    await this.portfolioModel.Portfolio.destroy({
      where: { kakao_id: userId, stock_id: keyword },
    });
  }
}
