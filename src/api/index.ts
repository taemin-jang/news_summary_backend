import { Router, Application } from "express";
import { SessionModule } from "../types/SessionModule";
import naverSearch from "./routes/naverSearch";
import chatGPT from "./routes/chatGPT";
import kakao from "./routes/kakao";

export default (session: SessionModule) => {
  const router = Router();
  kakao(router, session);
  naverSearch(router);
  chatGPT(router);
  return router;
};
