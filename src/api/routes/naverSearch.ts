import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { Logger } from "winston";
import config from "@config";
import axios, { AxiosResponse } from "axios";

export default (app: Router) => {
  const logger: Logger = Container.get("logger");

  // naver api test
  app.get("/naver/:keyword", async (req: Request, res: Response) => {
    try {
      const headers = {
        "X-Naver-Client-Id": config.naver_client_id,
        "X-Naver-Client-Secret": config.naver_client_secret,
        Accept: "*/*",
        "User-Agent": "curl/7.49.1",
        Host: config.naver_host,
      };

      const aixosResponse: AxiosResponse = await axios.get(
        `https://openapi.naver.com/v1/search/news.json?query=${req.params.keyword}`,
        { headers }
      );
      res.status(200).send(aixosResponse.data);
    } catch (err) {
      logger.error(err);
    }
  });
};
