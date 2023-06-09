export interface KakaoProfileResponse {
  id: number;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    email: string;
  };
}

export interface KakaoProfile {
  id: number;
  nickname: string;
  profile_image: string;
  thumbnail_image: string;
  email: string;
}
