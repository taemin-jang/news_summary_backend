import express, { Application, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import config from "@config";

const app: Application = express();
const port = config.port;

app.get("/", async (req: Request, res: Response) => {
  res.send("hello");
});

app.get("/naver", async (req: Request, res: Response) => {
  try {
    const headers = {
      "X-Naver-Client-Id": config.naver_client_id,
      "X-Naver-Client-Secret": config.naver_client_secret,
      Accept: "*/*",
      "User-Agent": "curl/7.49.1",
      Host: config.naver_host,
    };

    const aixosResponse: AxiosResponse = await axios.get(
      "https://openapi.naver.com/v1/search/news.json?query=WBC",
      { headers }
    );
    console.log(aixosResponse.data);
    res.status(200).send(aixosResponse.data);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log("실행되었습니다. http://localhost:3000");
});
