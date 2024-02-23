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
  const expectedKeys = ["name", "hansicsId", "price", "menuImg", "userData"];
  const expectedLength = expectedKeys.length;
  return inputLength === expectedLength ? true : false;
}
