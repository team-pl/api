export enum EApplyState {
  UNCONFIRMED = 'UNCONFIRMED', // '미확인' 상태
  CHECKED = 'CHECKED', // '확정 완료' 상태
  REJECT_CONFIRMED = 'REJECT_CONFIRMED', // '참여 거절' 상태
  CONFIRMED = 'CONFIRMED', // '참여 확정' 상태
  CONFIRMED_CANCELED = 'CONFIRMED_CANCELED', // '확정 취소' 상태
}

// NOTE: 조회할 때 사용하는 enum
export enum EGetApplyState {
  UNCONFIRMED = 'UNCONFIRMED', // '미확인' 상태
  CHECKED = 'CHECKED', // '확정 완료' 상태
  REJECT_CONFIRMED = 'REJECT_CONFIRMED', // '참여 거절' 상태
  CONFIRMED = 'CONFIRMED', // '참여 확정' 상태
  CONFIRMED_CANCELED = 'CONFIRMED_CANCELED', // '확정 취소' 상태
  ALL = 'ALL', // 모든 상태
}
