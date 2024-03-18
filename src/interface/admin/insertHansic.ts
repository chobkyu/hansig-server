export interface InsertHansicDto {
    id : number,
    name : string,
    addr : string,
    imgUrl : string,
    location : number,
    userId:number,
    userData: {
        id: number;
        userId: string;
        userNickname: string;
    };
}