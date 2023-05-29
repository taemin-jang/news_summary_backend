import { Router } from "express";
import naverSearch from "./routes/naverSearch";
import kakao from "./routes/kakao";
import stockPrice from "./routes/stockPrice";

export default () => {
  const router = Router();
  kakao(router);
  naverSearch(router);
  stockPrice(router);
  return router;
};
