import Container from "typedi";
import { Logger } from "winston";
import { ModelCtor, Sequelize } from "sequelize";
import { NaverNewsResponse } from "../types/NaverNewsResponse";
import { getContent } from "@services/articleContent";
import { getImage } from "@services/imageFromArticle";
import { getContentSummary } from "@services/contentSummary";
import { getGptKeyword } from "@services/gptKeyword";
import { PortfolioJoinArticle, ClovaSummary } from "../types/NaverNewsResponse";

export default class ArticleService {
  articleModel: ModelCtor<any>;
  portfolioModel: ModelCtor<any>;
  stockModel: ModelCtor<any>;
  test;
  constructor() {
    const db: Sequelize = Container.get("db");
    this.articleModel = db.models.Article;
    this.portfolioModel = db.models.Portfolio;
    this.stockModel = db.models.Stock;
    this.test = Sequelize.literal(
      "ROW_NUMBER() OVER (PARTITION BY portfolios.id ORDER BY articles.id DESC)"
    );
  }

  /**
   * Article 테이블에 뉴스 기사 등록하는 함수
   * @param article 뉴스 기사 정보
   * @param stock_id 주식 명
   */
  public async registArticle(article: NaverNewsResponse, stock_id: string) {
    try {
      await this.articleModel.create({
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

  /**
   * 개별 기사에 대한 정보를 처리하는 함수
   * @param article 기사 정보
   * @param keyword 주식명
   */
  public async processArticle(article, keyword) {
    const articleURL = article.link;
    const response = await fetch(articleURL);
    const htmlText = await response.text();
    const image = getImage(htmlText);

    if (image !== null) {
      article.images = image;
      const content = getContent(htmlText);
      article.content = content;

      if (content !== null) {
        const contentSummary = await getContentSummary(content, article.title);
        if (contentSummary.summary) {
          article.summary = contentSummary.summary;
          const keywordRes = await getGptKeyword(contentSummary.summary);
          const keywords = keywordRes
            ?.split("\n")
            .map((keyword) => keyword.split(". ")[1]);
          article.keywords = keywords;
          await this.registArticle(article, keyword);
        } else {
          article.summary = contentSummary.error;
        }
      }
    } else {
      article.images = null;
    }
  }

  /**
   * 뉴스 기사에 항목(이미지, 요약, 키워드 등)을 추가하는 함수
   * @param articleArray 뉴스 기사 리스트
   * @param keyword 주식 명
   */
  public async addArticleInfo(
    articleArray: NaverNewsResponse[],
    keyword: string
  ) {
    const regex = /news\.naver/;

    const processPromises = articleArray.map(async (article) => {
      if (regex.test(article.link)) {
        await this.processArticle(article, keyword);
      } else {
        article.images = null;
      }
    });

    await Promise.all(processPromises);
  }

  /**
   * 각 사용자가 등록한 포트폴리오의 뉴스 기사 반환하는 함수
   * @param user_id number
   * @returns
   */
  public async getUserArticle(
    user_id: string,
    page: number
  ): Promise<PortfolioJoinArticle[]> {
    const myPortfolio: PortfolioJoinArticle[] =
      await this.portfolioModel.findAll({
        where: {
          kakao_id: user_id,
        },
        include: [
          {
            model: this.articleModel,
            as: "article",
            order: [["id", "DESC"]],
            offset: page * 2,
            limit: 2,
          },
        ],
      });
    return myPortfolio;
  }

  public async getSearchArticle(
    user_id: string,
    keyword: string
  ): Promise<PortfolioJoinArticle[]> {
    const response: PortfolioJoinArticle[] = await this.portfolioModel.findAll({
      include: [
        {
          model: this.articleModel,
          as: "article",
          order: [["id", "DESC"]],
        },
      ],
      where: {
        kakao_id: user_id,
        stock_id: keyword,
      },
    });
    return response;
  }
}
