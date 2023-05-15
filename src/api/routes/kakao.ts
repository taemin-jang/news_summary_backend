import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { Logger } from "winston";
import KakaoService from "@services/kakaoProfile";

export default (app: Router) => {
  const logger: Logger = Container.get("logger");

  app.post("/kakao-login", async (req: Request, res: Response) => {
    try {
      const kakaoInstance = new KakaoService();
      const response = await kakaoInstance.getProfile(req.body.access_token);
      req.session.user = response.dataValues;
      res.status(200).json(response);
    } catch (error) {
      logger.error(error);
    }
  });
};
