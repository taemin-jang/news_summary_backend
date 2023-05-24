import { Router, Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import axios, { AxiosResponse } from "axios";
import config from "@config";
import moment from "moment";

export default (app: Router) => {
  const logger: Logger = Container.get("logger");
  const data = moment();
  // 키워드로 주식 정보 요청 시 주식 정보 반환
  app.get("/stock", async (req: Request, res: Response) => {
    try {
      const response: AxiosResponse = await axios.get(
        `${config.stock_base_url}/getStockPriceInfo?serviceKey=${
          config.stock_service_key
        }&basDt=${data.format("YYYYMMDD")}&itmsNm=${
          req.query.search
        }&resultType=json`
      );
      res.json(response.data.response.body.items);
    } catch (err) {
      logger.error(err);
    }
  });
};
