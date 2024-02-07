type TAuthUser = {
  name: string;
  phone: string;
};

type TLoginUser = {
  name: string;
  phone: string;
  email: string;
};

enum ESignUp {
  NAVER = 'NAVER', // 네이버
  KAKAO = 'KAKAO', // 카카오
}

export { TAuthUser, TLoginUser, ESignUp };
