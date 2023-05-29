import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import config from "@config";

const configuration = new Configuration({
  apiKey: config.openai_api_key,
});
const openai = new OpenAIApi(configuration);

/**
 * chatgpt에게 요약본 제공 후 핵심 키워드 추출하는 함수
 * @param message stirng, 뉴스 기사 요약본
 * @returns 핵심 키워드
 */
export const getGptKeyword = async (message: string) => {
  let messages: Array<ChatCompletionRequestMessage> = [
    {
      role: "system",
      content:
        "당신은 수많은 뉴스 기사, 논문, 포럼등을 읽으면서 해당 내용의 핵심 키워드들을 추출할 수 있습니다. 당신은 그 어떤 내용이 와도 핵심 키워드를 5개만 추출할 수 있습니다.",
    },
    {
      role: "user",
      content: `외국인이 코스피에서 전기전자와 자동차업종의 대형주를 중심으로 최대 규모의 순매수를 이어가는 것으로 나타났습니다.
SK하이닉스의 경우 올해 하루에 2000억원 넘게 순매수한 경우는 이달에만 3차례(16일·25일·26일) 있었습니다.
김동원 KB증권 연구원은 "올해 코스피시장과 삼성전자에 대한 외국인 순매수는 한국거래소가 통계를 집계한 1998년 이후 최대치"라며 "삼성전자가 반도체 다운사이클 이후 승자가 될 가능성이 높고 내년 반도체 상승 사이클 진입이 예상돼 삼성전자에 대한 머니무브는 당분간 지속될 것으로 예상한다"고 말했습니다.`,
    },
    {
      role: "assistant",
      content: `1. 외국인 순매수
2. 코스피 대형주
3. 전기전자 업종
4. 자동차 업종
5. SK하이닉스`,
    },
    {
      role: "user",
      content: `${message}`,
    },
  ];
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  return completion?.data.choices[0]?.message?.content;
};
