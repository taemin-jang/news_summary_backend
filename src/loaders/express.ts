import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import routes from "@api";
import history from "connect-history-api-fallback";

export default (app: express.Application) => {
  app.use(morgan("dev"));

  // X-Powered-By 막기 => X-Powered-By는 어떤 프레임워크와 기술을 이용했는지 알 수 있으므로 안보이도록 설정
  app.disable("x-powered-by");
  // /api 경로로 들어오면 api 폴더에 맞게 라우팅
  app.use("/api", routes());
  app.use(history());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
