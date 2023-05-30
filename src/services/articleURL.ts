import { getContent } from "@services/articleContent";
import { getImage } from "@services/imageFromArticle";
import { getContentSummary } from "@services/contentSummary";
import { getGptKeyword } from "@services/gptKeyword";
import ArticleService from "@services/articleServices";
import { NaverNewsResponse } from "../types/NaverNewsResponse";

/**
 * 네이버 기사 정보에 image를 추가해서 반환하는 함수
 * @param articleArray 네이버 search api로 받아온 뉴스 기사
 * @param id 해당 기사의 인덱스
 * @returns articleArray
 */
export const getArticle = async (
  articleArray: NaverNewsResponse[],
  id: number,
  keyword: string
) => {
  const ArticleInstance = new ArticleService();
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
      // 이미지를 뉴스 기사에 추가
      articleArray[id].images = image;
      const content = getContent(htmlText);
      // 기사 내용 추가
      articleArray[id].content = content;

      if (content !== null) {
        const contentSummary = await getContentSummary(
          content,
          articleArray[id].title
        );
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
          await ArticleInstance.registArticle(articleArray[id], keyword);
        } else articleArray[id].summary = contentSummary.error;
      }
    } else {
      // 네이버 뉴스 기사가 아닌경우 images에 null 추가
      articleArray[id].images = null;
    }
    await getArticle(articleArray, id + 1, keyword);
  }
  return articleArray;
};
