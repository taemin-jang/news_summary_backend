import Container from "typedi";
import { Logger } from "winston";
import { ModelCtor, Sequelize } from "sequelize";
import { NaverNewsResponse } from "../types/NaverNewsResponse";

export default class ArticleService {
  articleModle: ModelCtor<any>;
  constructor() {
    const db: Sequelize = Container.get("db");
    this.articleModle = db.models.Article;
  }

  /**
   * Article 테이블에 뉴스 기사 등록하는 함수
   * @param article 뉴스 기사 정보
   * @param stock_id 주식 명
   */
  public async registArticle(article: NaverNewsResponse, stock_id: string) {
    try {
      await this.articleModle.create({
        title: article.title,
        content: article.content,
        link: article.link,
        summary: article.summary,
        pubDate: article.pubDate,
        keywords: article.keywords,
        images: article.images,
        stock_id: stock_id,
      });
    } catch (err) {
      const logger: Logger = Container.get("logger");
      logger.error(err);
    }
  }
}
