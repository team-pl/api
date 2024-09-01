// NOTE: 알림 종류 enum
export enum ENotificationType {
  PROJECT = 'PROJECT',
  COMMENT = 'COMMENT',
  APPLY = 'APPLY',
  DEADLINE = 'DEADLINE',
}

// NOTE: 대시보드 상태 enum
export enum EDashboardState {
  APPLY = 'APPLY', // 지원완료
  CONFIRMED = 'CONFIRMED', // '참여 확정' 상태
  REGISTER = 'REGISTER', // 등록
}
