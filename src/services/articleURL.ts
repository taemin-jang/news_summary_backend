import { getContent } from "@services/articleContent";
import { getImage } from "@services/imageFromArticle";
import { getContentSummary } from "@services/contentSummary";
/**
 * 네이버 기사 정보에 image를 추가해서 반환하는 함수
 * @param articleArray 네이버 search api로 받아온 뉴스 기사
 * @param id 해당 기사의 인덱스
 * @returns articleArray
 */
export const getArticle = async (articleArray, id) => {
  // news.naver가 포함된 주소만 찾는 정규식
  const regex = /news\.naver/;
  // 기사 URL
  let articleURL = "";

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
        // 기사 요약 본 추가
        if (contentSummary.summary)
          articleArray[id].summary = contentSummary.summary;
        else articleArray[id].summary = contentSummary.error;
      }
    } else {
      // 네이버 뉴스 기사가 아닌경우 images에 null 추가
      articleArray[id].images = null;
    }
    await getArticle(articleArray, id + 1);
  }
  return articleArray;
};
