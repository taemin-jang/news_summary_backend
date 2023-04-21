import { Router } from "express";
import naverSearch from "./routes/naverSearch";
import chatGPT from "./routes/chatGPT";

export default () => {
  const app = Router();
  naverSearch(app);
  chatGPT(app);
  return app;
};
