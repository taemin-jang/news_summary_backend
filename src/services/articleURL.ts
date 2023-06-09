import config from "@config";
import Container from "typedi";
import { Logger } from "winston";
import axios, { AxiosResponse } from "axios";
import ArticleService from "@services/articleServices";
import StockService from "@services/stockList";
import { NaverNewsResponse } from "../types/NaverNewsResponse";

const headers = {
  "X-Naver-Client-Id": config.naver_client_id,
  "X-Naver-Client-Secret": config.naver_client_secret,
  Accept: "*/*",
  "User-Agent": "curl/7.49.1",
  Host: config.naver_host,
};

/**
 * 포트폴리오에 등록된 모든 주식의 뉴스 기사를 article 테이블에 저장
 * @param userid 사용자
 */
export const registAllPortfolioToArticle = async (userid: number) => {
  const logger: Logger = Container.get("logger");
  try {
    const ArticleInstance = new ArticleService();
    const StockInstance = new StockService();
    const portfolios = await StockInstance.getPortfolio(userid);

    for (let portfolio of portfolios) {
      // naver search api 호출
      const aixosResponse: AxiosResponse = await axios.get(
        `https://openapi.naver.com/v1/search/news.json?query=${portfolio.stock_id}&display=20`,
        { headers }
      );
      const articleArray: NaverNewsResponse[] = aixosResponse.data.items;
      await ArticleInstance.addArticleInfo(articleArray, portfolio.stock_id);
    }
  } catch (err) {
    logger.error(err);
  }
};

/**
 * 포트폴리오에 각 주식을 등록할때마다 뉴스 기사를 article 테이블에 저장
 * @param keyword
 */
export const registPortfolioToArticle = async (keyword: string) => {
  const logger: Logger = Container.get("logger");
  try {
    const ArticleInstance = new ArticleService();
    // naver search api 호출
    const aixosResponse: AxiosResponse = await axios.get(
      `https://openapi.naver.com/v1/search/news.json?query=${keyword}&display=20`,
      { headers }
    );
    const articleArray: NaverNewsResponse[] = aixosResponse.data.items;
    await ArticleInstance.addArticleInfo(articleArray, keyword);
  } catch (err) {
    logger.error(err);
  }
};
