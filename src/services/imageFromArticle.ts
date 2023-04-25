import { JSDOM } from "jsdom";
/**
 * 이미지 링크를 가져오는 함수
 * @param htmlText 외부 기사의 html
 * @returns imageURL
 */
export const getImage = (htmlText) => {
  /** https://imgnews.pstatic.net 문자열을 포함하면서 중간에 logo, profile, upload, origin은 포함하지 않는 정규식
   * logo와 profile, upload은 기자 사진
   * mimgnews는 관련 뉴스 사진들
   * origin은 함께 볼만한 프리미엄 뉴스 사진들
   */
  const regex =
    /^https:\/\/imgnews\.pstatic\.net\/(?!(?=.*logo)|(?=.*profile)|(?=.*upload)|(?=.*origin)).*$/i;

  // JSDOM 인스턴스 생성
  const dom = new JSDOM(htmlText);
  // 문서 객체 참조
  const document = dom.window.document;

  // 파싱된 문서에서 요소를 선택하고 조작
  const imgElement: NodeListOf<HTMLImageElement> =
    document.querySelectorAll("img");

  let imageURL: Array<string> = [];

  // NodeList는 배열과 유사한 구조지만 실제 배열이 아니라 출력하면 다르게 표시될 수 있어서
  // Array.from()를 사용하면 NodeList를 자바스크립트 배열로 변환할 수 있습니다.
  const imgElementArray: HTMLImageElement[] = Array.from(imgElement);

  for (let image of imgElementArray) {
    // src가 아닌 data-src 속성으로 되어 있을 경우
    const dataSrc: string | null = image.getAttribute("data-src");
    if (dataSrc !== null) {
      if (regex.test(dataSrc)) {
        imageURL.push(dataSrc);
      }
    }
    if (regex.test(image.src)) {
      imageURL.push(image.src);
    }
  }

  // imageURL이 없을 경우 null 반환
  if (imageURL.length) {
    return imageURL;
  } else {
    return null;
  }
};
