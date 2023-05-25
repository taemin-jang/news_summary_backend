import { Router, Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import StockService from "@services/stockList";

export default (app: Router) => {
  const logger: Logger = Container.get("logger");
  const StockInstance = new StockService();

  // 키워드로 주식 정보 요청 시 주식 정보 반환
  app.get("/stock", async (req: Request, res: Response) => {
    try {
      if (req.query.search !== undefined) {
        const response = await StockInstance.getStock(
          req.query.search.toString()
        );
        console.log(req.query.search.toString());
        console.log(response.data.response.body.items);
        res.json(response.data.response.body.items);
      }
    } catch (err) {
      logger.error(err);
    }
  });

  app.get("/stock/list", async (req: Request, res: Response) => {
    try {
      const response = await StockInstance.getAllStock();
      res.send(response);
    } catch (err) {
      logger.error(err);
    }
  });
};
