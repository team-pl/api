export enum EApplyState {
  UNCONFIRMED = 'UNCONFIRMED', // '미확인' 상태
  REJECT_CONFIRMED = 'REJECT_CONFIRMED', // '참여 거절' 상태
  CONFIRMED = 'UNCONFIRMED', // '참여 확정' 상태
  CONFIRMED_CANCELED = 'CONFIRMED_CANCELED', // '확정 취소' 상태
}
