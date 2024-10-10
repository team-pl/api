export const Time = {
  oneMonthBefore: 1000 * 60 * 60 * 24 * 30,
};

export const convertTimestampToKST = (timestamp) => {
  const date = new Date(timestamp);

  // NOTE: KST 시간대로 변환 (UTC + 9)
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(date.getTime() + kstOffset);

  return kstDate.toISOString().replace('T', ' ').substring(0, 19);
};
