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
   * 뉴스 기사에 항목(이미지, 요약, 키워드 등)을 추가하는 함수
   * @param articleArray 뉴스 기사 리스트
   * @param id 인덱스
   * @param keyword 주식 명
   */
  public async addArticleInfo(
    articleArray: NaverNewsResponse[],
    id: number,
    keyword: string
  ) {
    // news.naver가 포함된 주소만 찾는 정규식
    const regex = /news\.naver/;
    // 기사 URL
    let articleURL: string = "";

    if (id < articleArray.length) {
      // news.naver일 경우
      if (regex.test(articleArray[id].link)) {
        articleURL = articleArray[id].link;
        // 해당 기사 정보 요청
        const response = await fetch(articleURL);
        // 기사의 htmlText 요청
        const htmlText = await response.text();
        // htmlText에 있는 이미지
        const image = getImage(htmlText);
        if (image !== null) {
          // 이미지를 뉴스 기사에 추가
          articleArray[id].images = image;
          const content = getContent(htmlText);
          // 기사 내용 추가
          articleArray[id].content = content;

          if (content !== null) {
            let contentSummary: ClovaSummary = await getContentSummary(
              content,
              articleArray[id].title
            ).then((result) => result);
            if (contentSummary.summary) {
              // 기사 요약본 추가
              articleArray[id].summary = contentSummary.summary;
              // 기사 핵심 키워드 추가
              const keywordRes = await getGptKeyword(contentSummary.summary);
              const keywords = keywordRes
                ?.split("\n")
                .map((keyword) => keyword.split(". ")[1]);
              articleArray[id].keywords = keywords;

              // 기사에 추가한 내용 db 등록
              await this.registArticle(articleArray[id], keyword);
            } else articleArray[id].summary = contentSummary.error;
          }
        }
      } else {
        // 네이버 뉴스 기사가 아닌경우 images에 null 추가
        articleArray[id].images = null;
      }
      await this.addArticleInfo(articleArray, id + 1, keyword);
    }
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
