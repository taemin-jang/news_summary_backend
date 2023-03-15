import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find src/.env");
}
export default {
  port: process.env.PORT,

  naver_client_id: process.env.NAVER_CLIENT_ID as string,
  naver_client_secret: process.env.NAVER_CLIENT_SECRET as string,

  openai_api_key: process.env.OPENAI_API_KEY as string,
};
