import { Router, Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import KakaoService from "@services/kakaoProfile";

export default (app: Router) => {
  const logger: Logger = Container.get("logger");

  // kakao OAuth로 로그인 후 kakaoProfile 반환
  app.post("/kakao/login", async (req: Request, res: Response) => {
    try {
      const kakaoInstance = new KakaoService();
      const response = await kakaoInstance.getProfile(req.body.access_token);
      if (!req.session.user) {
        req.session.user = response.dataValues;
      }
      res.status(200).json(response);
    } catch (error) {
      logger.error(error);
    }
  });

  // front에서 카카오 프로필 요청 시 session에 있는 정보 반환
  app.get("/kakao/info", async (req: Request, res: Response) => {
    try {
      if (req.session.user) {
        res.status(200).json(req.session.user);
      } else
        res.status(204).json({
          message:
            "가입된 사용자 정보가 없습니다. 가입하지 않으셨다면 회원가입하시기 바랍니다.",
        });
    } catch (error) {
      logger.error(error);
    }
  });

  // 로그아웃 요청 시 session 정보 삭제
  app.get("/kakao/logout", async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        logger.error("Error destroying session: ", err);
      } else {
        logger.info("Session destroyed successfully.");
        res.status(200);
      }
    });
  });
};
