import { hansics, PrismaClient } from "@prisma/client";
const request = require('request');
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
  async getByPlace(lat:Number,lng:Number)
  {
    try {
      const data = await prisma.$queryRaw<any[]>`
        SELECT
          hs.id,
          hs.name,
          hs.addr,
          hs."userStar",
          hs.google_star,
          hs.location_id,
          hs.lat,
          hs.lng,
          ls.location,
          si."imgUrl"
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId" WHERE hs.lat=${lat} AND hs.lng=${lng} 
        ORDER BY hs.id ASC
      `;
      console.log(data);
      if (data) {
        return data;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false
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
          hs.lat,
          hs.lng,
          ls.location,
          si."imgUrl" 
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId" 
        WHERE hs.id=${restaurantId}
      `;

      //console.log(data);
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
          hs.lat,
          hs.lng,
          ls.location,
          si."imgUrl"
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId" WHERE hs.location_id=${locationId} 
        ORDER BY hs.id ASC
      `;
      
      console.log(data);
      if (data) {
        return data;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false
    }
  }
  //전체조회
  async getAll(): Promise<any[] | false> {
    try {
      const data = await prisma.$queryRaw<any[]>`
        SELECT
          hs.id,
          hs.name,
          hs.addr,
          hs."userStar",
          hs.google_star,
          hs.location_id,
          hs.lat,
          hs.lng,
          ls.location,
          si."imgUrl" 
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId" 
        ORDER BY hs.id ASC
      `;

      //console.log(data);
      if (data) {
        return data;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false
    }
  }

  //주소 -> 좌표 변환
  async convert(){
    try{
      const response :any = await this.getAll();
      console.log(response);
      for(var i = 0; i<response.length; i++){
        //console.log(response[i].addr);
        
        if(response[i].addr!='주소 없음'){
          await this.tryGeo(response[i])

        }
      }
      return {success:true};
    }catch(err){
      console.error(err);
      return {success:false};
    }
  }

  //kakao api 호출, 주소 -> 좌표 변환
  async tryGeo(hansic:any) {
    try{
      const addr = hansic.addr
      const option = {
        uri:'https://dapi.kakao.com/v2/local/search/address',
        qs:{
          query:addr
        },
        headers: {Authorization: `KakaoAK ${process.env.kakao_api}`}
      }

      //카카오 api 호출
      request(option,async (err:any,response:any,body:any) => {
        console.log(body);
        const obj = JSON.parse(body);
        
        if(!obj["documents"]?.length){
          console.log('can not find address');
        }else{
          console.log(obj["documents"][0].x)  //lng
          console.log(obj["documents"][0].y)  //lat 
          let lng = parseFloat(obj["documents"][0].x);
          let lat = parseFloat(obj["documents"][0].y);
          
          await this.updateGeo(hansic.id,lng,lat);
        }
      });

      return true;
    }catch(err){
      console.error(err);
      return false;
    }
  }

  //좌표 데이터베이스에 저장
  async updateGeo(id:number, lng:number, lat:number){
    try{
      const updateHansics = await prisma.hansics.update({
        where : {
          id:id,
        },
        data:{
          lat:lat,
          lng:lng,
        }
      });

      console.log(updateHansics);

      return {success:true};
    }catch(err){
      console.error(err);
      return {success:false};
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