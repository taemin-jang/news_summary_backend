import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { Logger } from "winston";
import config from "@config";
import axios, { AxiosResponse } from "axios";
import { getArticle } from "@services/articleURL";
import { NaverNewsResponse } from "../../types/NaverNewsResponse";

export default (app: Router) => {
  const logger: Logger = Container.get("logger");

  /**
   * naver search api로 뉴스 기사를 받음
   * 각 기사에 이미지들을 추가하고 네이버 뉴스만 가져와 반환
   */
  app.get("/naver/:keyword", async (req: Request, res: Response) => {
    try {
      const headers = {
        "X-Naver-Client-Id": config.naver_client_id,
        "X-Naver-Client-Secret": config.naver_client_secret,
        Accept: "*/*",
        "User-Agent": "curl/7.49.1",
        Host: config.naver_host,
      };
      // naver search api 호출
      const aixosResponse: AxiosResponse = await axios.get(
        `https://openapi.naver.com/v1/search/news.json?query=${req.params.keyword}&display=10`,
        { headers }
      );
      // 네이버 뉴스 기사 저장
      let articles: NaverNewsResponse[] = [];
      // 뉴스 기사에 이미지를 추가하고 네이버 뉴스 기사만 articles에 저장
      await getArticle(aixosResponse.data.items, 0, req.params.keyword).then(
        (result) =>
          (articles = result.filter((article) => article.images !== null))
      );
      res.status(200).send(articles);
    } catch (err) {
      logger.error(err);
    }
  });
};
