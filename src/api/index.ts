import { Router } from "express";
import naverSearch from "./routes/naverSearch";
import chatGPT from "./routes/chatGPT";
import kakao from "./routes/kakao";

export default () => {
  const app = Router();
  naverSearch(app);
  chatGPT(app);
  kakao(app);
  return app;
};
