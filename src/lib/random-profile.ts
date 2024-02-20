export const randomProfile = () => {
  const profileList = [
    'https://teampl-plus.s3.ap-northeast-2.amazonaws.com/1708149548098/Frame 26087704.png',
    'https://teampl-plus.s3.ap-northeast-2.amazonaws.com/1708149750207/Frame 26087705.png',
    'https://teampl-plus.s3.ap-northeast-2.amazonaws.com/1708149795420/Frame 26087706.png',
    'https://teampl-plus.s3.ap-northeast-2.amazonaws.com/1708149837627/Frame 26087707.png',
    'https://teampl-plus.s3.ap-northeast-2.amazonaws.com/1708149866392/Frame 26087708.png',
  ];

  const randomIndex = Math.round(Math.random() * 4);

  return profileList[randomIndex];
};
