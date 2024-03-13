export interface EnrollHansicDto {
    name : string,
    addr : string,
    imgUrl : string,
    location : number,
    userData: {
        id: number;
        userId: string;
        userNickname: string;
    };
}