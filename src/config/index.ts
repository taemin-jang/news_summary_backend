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

  naver_clova_summary_key_id: process.env.X_NCP_APIGW_API_KEY_ID as string,
  naver_clova_summary_key: process.env.X_NCP_APIGW_API_KEY as string,
  naver_clova_summary_base_url: process.env.X_NCP_APIGW_API_BASE_URL as string,

  openai_api_key: process.env.OPENAI_API_KEY as string,

  logs: {
    level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  },

  host: process.env.HOST as string,
  mysql_port: process.env.MYSQL_PORT,
  user: process.env.USER as string,
  password: process.env.PASSWORD as string,
  database: process.env.DATABASE as string,

  session_key: process.env.SESSION_KEY as string,
  session_secret: process.env.SESSION_SECRET as string,

  stock_service_key: process.env.STOCK_SERVICE_KEY as string,
  stock_base_url: process.env.STOCK_BASE_URL as string,
};
