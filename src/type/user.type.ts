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

enum EJob {
  DESIGN = 'DESIGNER', // 디자이너
  ENGINEER = 'ENGINEER', // 엔지니어
}

export { TAuthUser, TLoginUser, ESignUp, EJob };
