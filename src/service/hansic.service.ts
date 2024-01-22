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
  async get(restaurantId: number): Promise<any> {
    try {
      const data = await prisma.hansics.findFirst({include : {location : true, sicdangImgs : true},where : {
          id : restaurantId,
        },
      });
      console.log(data);
      if (data) {
        const rtdata={ 
          id : data.id,
          name : data.name,
          addr : data.addr,
          google_star : data.google_star,
          userStar : data.userStar,
          location_id : data.location_id,
          location : data.location.location,
          imgUrl : data.sicdangImgs}
          console.log(rtdata);
        return rtdata;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
  async getFromLocation(locationId: number): Promise<any[]|false> {
    try {
      const data = await prisma.hansics.findMany(
        {include : {location : true, sicdangImgs : true},where:{location_id:locationId}, take : 10});
        console.log(data);
    if (data) {
      const rtdata =
          await Promise.all(data.map(element => ({
                                       id : element.id,
                                       name : element.name,
                                       addr : element.addr,
                                       google_star : element.google_star,
                                       userStar : element.userStar,
                                       location_id : element.location_id,
                                       location : element.location.location,
                                       imgUrl : element.sicdangImgs
                                     })))
      console.log(rtdata);
      return rtdata;
    } else {
      return false;
    }
    } catch (err) {
      return false
    }
  }
  async getAll(): Promise<any[]|false> {
    try {
      const data = await prisma.hansics.findMany(
          {include : {location : true, sicdangImgs : true}, take : 10});
      if (data) {
        const rtdata =
            await Promise.all(data.map(element => ({
                                         id : element.id,
                                         name : element.name,
                                         addr : element.addr,
                                         google_star : element.google_star,
                                         userStar : element.userStar,
                                         location_id : element.location_id,
                                         location : element.location.location,
                                         imgUrl : element.sicdangImgs
                                       })))
        console.log(rtdata);
        return rtdata;
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