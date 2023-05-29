import { JSDOM } from "jsdom";
/**
 * 뉴스 기사 내용를 가져오는 함수
 * @param htmlText 외부 기사의 html
 * @returns imageURL
 */
export const getContent = (htmlText: string): string | null => {
  // JSDOM 인스턴스 생성
  const dom = new JSDOM(htmlText);
  // 문서 객체 참조
  const document = dom.window.document;

  // 파싱된 문서에서 요소를 선택하고 조작
  const textElement: HTMLDivElement = document.querySelector("#dic_area");

  if (textElement !== null) {
    return textElement.textContent;
  } else return null;
};
