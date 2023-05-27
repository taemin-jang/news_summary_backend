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
          req.query.search.toString(),
          (req.session as any)?.user.id
        );
        res.json(response.data.response.body.items.item);
      }
    } catch (err) {
      logger.error(err);
    }
  });

  // 주식 리스트와 portfolio에 등록된 주식 반환
  app.get("/stock/list", async (req: Request, res: Response) => {
    try {
      const response = await Promise.all([
        StockInstance.getAllStock(),
        StockInstance.getPortfolio((req.session as any)?.user.id),
      ]);
      res.send(response);
    } catch (err) {
      logger.error(err);
    }
  });

  // portfolio에 등록된 주식의 정보 반환 (현재가, 전일 대비 등락 등)
  app.post("/stock/portfolio", async (req: Request, res: Response) => {
    try {
      const response = await StockInstance.getRegistedStockInfo(req.body);
      res.send(response);
    } catch (err) {
      logger.error(err);
    }
  });
};
