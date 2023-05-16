import { Router, Request, Response, Application } from "express";
import Container from "typedi";
import { Logger } from "winston";
import KakaoService from "@services/kakaoProfile";
import { SessionModule } from "src/types/SessionModule";

export default (app: Router, session: SessionModule) => {
  const logger: Logger = Container.get("logger");

  app.post("/kakao/login", async (req: Request, res: Response) => {
    try {
      const kakaoInstance = new KakaoService();
      const response = await kakaoInstance.getProfile(req.body.access_token);
      if (!session.user) session.user = response.dataValues;
      res.status(200).json(response);
    } catch (error) {
      logger.error(error);
    }
  });

  // front에서 카카오 프로필 요청 시 session에 있는 정보 반환
  app.get("/kakao/info", async (req: Request, res: Response) => {
    try {
      if (session.user) {
        console.log(session.user);
        res.status(200).json(session.user);
      } else
        res.status(204).json({
          message:
            "가입된 사용자 정보가 없습니다. 가입하지 않으셨다면 회원가입하시기 바랍니다.",
        });
    } catch (error) {
      logger.error(error);
    }
  });
  return app;
};
