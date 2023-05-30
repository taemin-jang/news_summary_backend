import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { getArticle } from "@services/articleURL";
import { NaverNewsResponse } from "../../types/NaverNewsResponse";
import ArticleService from "@services/articleServices";

export default (app: Router) => {
  const logger: Logger = Container.get("logger");

  /**
   * naver search api로 뉴스 기사를 받음
   * 각 기사에 이미지들을 추가하고 네이버 뉴스만 가져와 반환
   */
  app.get("/naver/:keyword", async (req: Request, res: Response) => {
    try {
      const ArticleInstance = new ArticleService();
      // 네이버 뉴스 기사 저장
      let articles: NaverNewsResponse[] = [];
      await ArticleInstance.getUserArticle((req.session as any)?.user.id).then(
        (result) => {
          articles = Array.from(result);
        }
      );

      // 주식 포트폴리오 등록한 주식 기사 데이터베이스 저장
      // await getArticle((req.session as any)?.user.id, req.params.keyword).then(
      //   (result) =>
      //     (articles = result.filter((article) => article.images !== null))
      // );
      console.log(articles);
      res.status(200).send(articles);
    } catch (err) {
      logger.error(err);
    }
  });
};
