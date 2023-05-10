import axios from "axios";
import Container from "typedi";
import { Logger } from "winston";
import { ModelCtor, Sequelize } from "sequelize";
import { KakaoProfileResponse } from "../types/kakaoProfileResponse";

export default class KakaoService {
  kakaoModel: ModelCtor<any>;
  constructor() {
    const db: Sequelize = Container.get("db");
    this.kakaoModel = db.models.Kakao;
  }

  public async getProfile(accessToken: string) {
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      let kakaoProfile = response.data;
      kakaoProfile = await this.handleKakaoProfile(kakaoProfile);
      return kakaoProfile;
    } catch (error) {
      const logger: Logger = Container.get("logger");
      logger.error("kakaoProfile Error : ", error);
      return error;
    }
  }

  public async handleKakaoProfile(profile: KakaoProfileResponse) {
    let kakaoUser = await this.kakaoModel.findOne({
      where: {
        id: profile.id,
      },
    });

    // 사용자가 없을 경우 새 사용자를 생성
    if (!kakaoUser) {
      kakaoUser = await this.kakaoModel.create({
        id: profile.id,
        nickname: profile.properties.nickname,
        profile_image: profile.properties.profile_image,
        thumbnail_image: profile.properties.thumbnail_image,
        email: profile.kakao_account.email,
      });
    }
    return kakaoUser;
  }
}
