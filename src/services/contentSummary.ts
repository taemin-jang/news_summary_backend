import axios from "axios";
import config from "@config";

export const getContentSummary = async (content: string, title: string) => {
  title = title
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<b>|<\/b>/g, "");

  content = content.replace(/\t|\n/g, "").slice(0, 1900);

  const data = {
    document: {
      title: title,
      content: content,
    },
    option: {
      language: "ko",
      model: "news",
      tone: 2,
      summaryCount: 3,
    },
  };

  const headers = {
    "X-NCP-APIGW-API-KEY-ID": config.naver_clova_summary_key_id,
    "X-NCP-APIGW-API-KEY": config.naver_clova_summary_key,
    "Content-Type": "application/json",
  };

  const response = await axios
    .post(config.naver_clova_summary_base_url, data, { headers })
    .then((result) => result.data)
    .catch((err) => err.response.data);
  return response;
};
