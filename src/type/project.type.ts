enum ECategory1 {
  DESIGN = 'DESIGN', // 디자인
  DEVELOPER = 'DEVELOPER', // 개발
  ETC = 'ETC', // 기타
}

enum ECategory2 {
  DEV_BE = 'DEV_BE', // 백엔드
  DEV_FE = 'DEV_FE', // 프론트엔드
  DEV_FULL_STACK = 'DEV_FULL_STACK', // 웹 풀스택
  DEV_ANDROID = 'DEV_ANDROID', // 안드로이드
  DEV_IOS = 'DEV_IOS', // IOS
  DEV_GAME_CLIENT = 'DEV_GAME_CLIENT', // 게임 클라이언트
  DEV_GAME_SERVER = 'DEV_GAME_SERVER', // 게임 서버
  DEV_DATA = 'DEV_DATA', // 데이터
  DEV_AI = 'DEV_AI', // 인공지능/머신러닝
  DEV_ETC = 'DEV_ETC', // 기타 개발분야
  DESIGN_UX = 'DESIGN_UX', // UX디자이너
  DESIGN_GUI = 'DESIGN_GUI', // GUI디자이너
  DESIGN_GRAPHIC = 'DESIGN_GRAPHIC', // 그래픽 디자이너
  DESIGN_BRAND = 'DESIGN_BRAND', // 브랜드 디자이너
  DESIGN_VIDEO = 'DESIGN_VIDEO', // 영상 디자이너
  DESIGN_3D = 'DESIGN_3D', // 3D 디자이너
  DESIGN_BI = 'DESIGN_BI', // BI(Brand identity) 디자이너
  DESIGN_BE = 'DESIGN_BE', // BE(Brand experience) 디자이너
  DESIGN_ETC = 'DESIGN_ETC', // 기타 디자인분야
  ETC = 'ETC', // 기타
}

enum EProjectState {
  RECRUITING = 'RECRUITING', // 모집중
  COMPLETED = 'COMPLETED', // 모집완료
  END = 'END', // 모집종료
}

// NOTE: 프로젝트 찾기 페이지에서 카테고리별로 검색할 때 사용
enum ECategorySelect {
  ALL = 'ALL', // 전체
  DESIGN = 'DESIGN', // 디자인
  DEVELOPER = 'DEVELOPER', // 개발
  ETC = 'ETC', // 기타
}

// NOTE: 프로젝트 찾기 페이지에서 하위 카테고리별로 검색할 때 사용
enum ESubCategorySelect {
  ALL = 'ALL', // 전체
  DEV_BE = 'DEV_BE', // 백엔드
  DEV_FE = 'DEV_FE', // 프론트엔드
  DEV_FULL_STACK = 'DEV_FULL_STACK', // 웹 풀스택
  DEV_ANDROID = 'DEV_ANDROID', // 안드로이드
  DEV_IOS = 'DEV_IOS', // IOS
  DEV_GAME_CLIENT = 'DEV_GAME_CLIENT', // 게임 클라이언트
  DEV_GAME_SERVER = 'DEV_GAME_SERVER', // 게임 서버
  DEV_DATA = 'DEV_DATA', // 데이터
  DEV_AI = 'DEV_AI', // 인공지능/머신러닝
  DEV_ETC = 'DEV_ETC', // 기타 개발분야
  DESIGN_UX = 'DESIGN_UX', // UX디자이너
  DESIGN_GUI = 'DESIGN_GUI', // GUI디자이너
  DESIGN_GRAPHIC = 'DESIGN_GRAPHIC', // 그래픽 디자이너
  DESIGN_BRAND = 'DESIGN_BRAND', // 브랜드 디자이너
  DESIGN_VIDEO = 'DESIGN_VIDEO', // 영상 디자이너
  DESIGN_3D = 'DESIGN_3D', // 3D 디자이너
  DESIGN_BI = 'DESIGN_BI', // BI(Brand identity) 디자이너
  DESIGN_BE = 'DESIGN_BE', // BE(Brand experience) 디자이너
  DESIGN_ETC = 'DESIGN_ETC', // 기타 디자인분야
  ETC = 'ETC', // 기타
}

export {
  ECategory1,
  ECategory2,
  EProjectState,
  ECategorySelect,
  ESubCategorySelect,
};
