import {hansics, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
/*
ㄴ 리뷰 입력 시
ㄴ 리뷰 수정 시
ㄴ 리뷰 삭제 시
ㄴ 메뉴 입력 시
ㄴ 메뉴 수정 시
ㄴ 메뉴 삭제 시
ㄴ 리뷰 댓글 입력 시
ㄴ 리뷰 댓글 삭제 시
*/

class HansicService {
  async getHansicDate() {
    try {
      const data =
          await prisma.hansics.findMany({include : {location : true}});
      return { data, success: true }
    } catch (err) {
      console.error(err);
      return { success: false }
    }
  }
  //식당id로 조회
  async get(restaurantId: number): Promise<any> {
    try {
      const data = await prisma.hansics.findFirst({include : {location : true, sicdangImgs : true},where : {
          id : restaurantId,
        },
      });
      console.log(data);
      if (data) {
        return data;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
  //지역id로 조회
  async getFromLocation(locationId: number): Promise<any[]|false> {
    try {
      const data = await prisma.hansics.findMany(
        {include : {location : true, sicdangImgs :true},where:{location_id:locationId}, take : 10});
        console.log(data);
    if (data) {
      return data;
    } else {
      return false;
    }
    } catch (err) {
      return false
    }
  }
  //전체조회
  async getAll(): Promise<any[]|false> {
    try {
      const data = await prisma.hansics.findMany(
          {include : {location : true, sicdangImgs : true}, take : 10});
      if (data) {
        return data;
      } else {
        return false;
      }
    } catch (err) {
      return false
    }
  }
  // async create(restaurantId:number,req:Request):Promise<boolean>
  // {
  //     const requestBody=req.body;
  //     return true;
  // }
  // menu={
  //     async getAll(){
  //         try{
  //             const data = await prisma.review.findMany();
  //             //console.log(data)

  //             return {data,success:true}
  //         }catch(err){
  //             console.error(err);
  //             return {success:false}
  //         }
  //     },
  //     async get(req:Request){
  //         try{
  //             const data = await prisma.hansics.findMany();
  //             //console.log(data)

  //             return {data,success:true}
  //         }catch(err){
  //             console.error(err);
  //             return {success:false}
  //         }
  //     },
  // };
}

module.exports = HansicService