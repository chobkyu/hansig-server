export interface MenuData {
  name: string;
  hansicsId: number;
  price: number;
  menuImg: string;
  userData: {
    id: number;
    userId: string;
    userNickname: string;
  };
}

export function checkMenuDataCount(inputLength: number) {
  const expectedLength = 5;
  return inputLength === expectedLength ? true : false;
}
