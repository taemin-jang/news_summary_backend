import express, { Request, Response, NextFunction, Router } from "express";
import morgan from "morgan";
import routes from "@api";
import history from "connect-history-api-fallback";
import session from "./session";
import cookieParser from "cookie-parser";

export default (app: express.Application) => {
  app.use(morgan("dev"));
  // X-Powered-By 막기 => X-Powered-By는 어떤 프레임워크와 기술을 이용했는지 알 수 있으므로 안보이도록 설정
  app.disable("x-powered-by");
  // express.json으로 클라이언트에서 전송되는 데이터를 JSON으로 파싱
  app.use(express.json());
  // 클라이언트가 URL 인코딩된 데이터를 전송할 경우
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname + "/../public"));
  // cookie middlewares
  app.use(cookieParser());
  // session middleware
  app.use(session);
  // /api 경로로 들어오면 api 폴더에 맞게 라우팅
  app.use("/api", routes());
  app.use(history());

  app.use((req, res, next) => {
    const err: any = new Error("Not Found");
    err["status"] = 404;
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
