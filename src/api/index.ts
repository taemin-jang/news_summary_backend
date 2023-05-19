import { Router } from "express";
import naverSearch from "./routes/naverSearch";
import chatGPT from "./routes/chatGPT";
import kakao from "./routes/kakao";

export default () => {
  const router = Router();
  kakao(router);
  naverSearch(router);
  chatGPT(router);
  return router;
};
