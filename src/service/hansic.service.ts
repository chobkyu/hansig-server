import { hansics, PrismaClient } from "@prisma/client";

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
        await prisma.hansics.findMany({ include: { location: true } });
      return { data, success: true }
    } catch (err) {
      console.error(err);
      return { success: false }
    }
  }
  //식당id로 조회
  async get(restaurantId: number): Promise<any> {
    try {
      const data = await prisma.$queryRaw<any>`
        SELECT 
          hs.id,
          hs.name,
          hs.addr,
          hs."userStar",
          hs.google_star,
          hs.location_id,
          ls.location,
          si."imgUrl" 
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId" 
        WHERE hs.id=${restaurantId}
      `;

      console.log(data);
      if (data[0]) {
        return data[0];
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
  //지역id로 조회
  async getFromLocation(locationId: number): Promise<any[] | false> {
    try {
      const data = await prisma.$queryRaw<any[]>`
        SELECT
          hs.id,
          hs.name,
          hs.addr,
          hs."userStar",
          hs.google_star,
          hs.location_id,
          ls.location,
          si."imgUrl"
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId" W
        HERE hs.location_id=${locationId} 
        ORDER BY hs.id ASC
      `;
      
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
  async getAll(): Promise<any[] | false> {
    try {
      const data = await prisma.$queryRaw<any[]>`SELECT hs.id,hs.name,hs.addr,hs."userStar",hs.google_star,hs.location_id,ls.location,si."imgUrl" FROM hansics as hs INNER JOIN location as ls on hs.location_id=ls.id LEFT JOIN "sicdangImg" as si on hs.id=si."hansicsId" ORDER BY hs.id ASC`;
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