import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find src/.env");
}
export default {
  db: process.env.NEWS_SUMMARY_DB as string,

  port: process.env.PORT,

  naver_client_id: process.env.NAVER_CLIENT_ID as string,
  naver_client_secret: process.env.NAVER_CLIENT_SECRET as string,
  naver_host: process.env.NAVER_HOST as string,

  openai_api_key: process.env.OPENAI_API_KEY as string,

  logs: {
    level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  },
};
