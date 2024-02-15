import { hansics, PrismaClient } from "@prisma/client";
import { favoriteDto } from "../interface/hansic/favorite";
import { log } from "winston";
const request = require('request');
const prisma = new PrismaClient();
const logger = require('../util/winston');
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
      logger.error(err);
      return { success: false }
    }
  }
  //좌표로 조회
  async getByPlace(lat: Number, lng: Number, userId?: Number) {
    try {
      //좌표로 단일 검색
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
          si."imgUrl",
          rd.count
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId"
        LEFT JOIN (
          SELECT 
            rv."hansicsId",
            COUNT(*) as count 
          FROM hansic.review as rv 
          GROUP BY rv."hansicsId"
        ) as rd
        on hs.id=rd."hansicsId"
        WHERE hs.lat=${lat} or hs.lng=${lng} 
      `;

      console.log(data);
      //user정보가 넘어왔을시 favorite확인

      let favorite;

      if (userId) {
        let findStar = await prisma.favorites.findFirst({ 
          where: { 
            userId: Number(userId), 
            hansicsId: data[0].id 
          }
        });

        favorite = findStar?.useFlag == null ? false : findStar.useFlag;
      }
      else {
        //유저정보가 넘어오지 않은경우
        favorite = false;
      }

      console.log(favorite);
      if (data.length > 0) {
        data[0].count = Number(data[0].count);
        //즐겨찾기 되어 있으면 true
        data[0].favorite = favorite;
        return data[0];
      } else {
        return false;
      }

    } catch (err) {
      logger.error(err);
      return false
    }
  }
  //식당id로 단일 조회
  async get(restaurantId: number, userId?: number): Promise<Object | false> {
    try {
      let favorite;
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
      si."imgUrl",
      rd.count
    FROM hansics as hs 
    INNER JOIN location as ls 
    on hs.location_id=ls.id 
    LEFT JOIN "sicdangImg" as si 
    on hs.id=si."hansicsId"
    LEFT JOIN (SELECT rv."hansicsId",COUNT(*) as count FROM hansic.review as rv GROUP BY rv."hansicsId") as rd
on hs.id=rd."hansicsId"
    WHERE hs.id=${restaurantId}
  `;
      //user정보가 넘어왔을시 favorite확인
      if (userId) {
        favorite = await prisma.favorites.findFirst({ where: { userId: userId, hansicsId: restaurantId } });

      }
      else {
        //유저정보가 넘어오지 않은경우
        favorite = false;
      }
      if (data.length > 0) {
        data[0].count = Number(data[0].count);
        //즐겨찾기 되어 있으면 true
        data[0].favorite = favorite ? true : false;
        return data[0];
      } else {
        return false;
      }

    } catch (err) {
      logger.error(err);
      return false;
    }
  }
  //지역id로 지역내 식당리스트 조회
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
        on hs.id=si."hansicsId" 
        WHERE hs.location_id=${locationId} 
        ORDER BY hs.id ASC
      `;

      logger.info(data);
      if (data) {
        return data;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(err);
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
        where lat != 0
        ORDER BY hs.id ASC
      `;

      logger.info(data);
      if (data) {
        return data;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(err);
      return false
    }
  }

  //주소 -> 좌표 변환
  async convert() {
    try {
      const response: any = await this.getAll();
      logger.info(response);
      for (var i = 0; i < response.length; i++) {
        //logger.info(response[i].addr);

        if (response[i].addr != '주소 없음') {
          await this.tryGeo(response[i])

        }
      }
      return { success: true };
    } catch (err) {
      logger.error(err);
      return { success: false };
    }
  }

  //kakao api 호출, 주소 -> 좌표 변환
  async tryGeo(hansic: any) {
    try {
      const addr = hansic.addr
      const option = {
        uri: 'https://dapi.kakao.com/v2/local/search/address',
        qs: {
          query: addr
        },
        headers: { Authorization: `KakaoAK ${process.env.kakao_api}` }
      }

      //카카오 api 호출
      request(option, async (err: any, response: any, body: any) => {
        logger.info(body);
        const obj = JSON.parse(body);

        if (!obj["documents"]?.length) {
          logger.info('can not find address');
        } else {
          logger.info(obj["documents"][0].x)  //lng
          logger.info(obj["documents"][0].y)  //lat 
          let lng = parseFloat(obj["documents"][0].x);
          let lat = parseFloat(obj["documents"][0].y);

          await this.updateGeo(hansic.id, lng, lat);
        }
      });

      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  //좌표 데이터베이스에 저장
  async updateGeo(id: number, lng: number, lat: number) {
    try {
      const updateHansics = await prisma.hansics.update({
        where: {
          id: id,
        },
        data: {
          lat: lat,
          lng: lng,
        }
      });

      logger.info(updateHansics);

      return { success: true };
    } catch (err) {
      logger.error(err);
      return { success: false };
    }
  }

  async favorite(hansicId: number, body: favoriteDto) {
    try {
      console.log(body.userData.id);

      const findHansic = await this.get(hansicId);
      console.log(findHansic);

      if (!findHansic) return { success: false, status: 404 }
      //transaction
      prisma.$transaction(async (tx) => {
        const selectFavorite = await tx.favorites.findFirst({
          where: {
            userId: body.userData.id,
            hansicsId: hansicId,
          }
        });

        if (selectFavorite != null) {
          //즐겨찾기 데이터가 있을 시 update

          const updateFavoite = selectFavorite.useFlag == true ?

            await tx.favorites.update({
              where: {
                id: selectFavorite.id
              },
              data: {
                useFlag: false
              }
            }) :

            await tx.favorites.update({
              where: {
                id: selectFavorite.id
              },
              data: {
                useFlag: true
              }
            });
        } else {
          //즐겨찾기 데이터가 없을 시 insert
          const insertFavorite = await tx.favorites.create({
            data: {
              userId: body.userData.id,
              hansicsId: hansicId,
            }
          });
        }

      });

      return { success: true, status: 201 };

    } catch (err) {
      logger.error(err);
      return { success: false, status: 500 };
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
  //             //logger.info(data)

  //             return {data,success:true}
  //         }catch(err){
  //             logger.error(err);
  //             return {success:false}
  //         }
  //     },
  //     async get(req:Request){
  //         try{
  //             const data = await prisma.hansics.findMany();
  //             //logger.info(data)

  //             return {data,success:true}
  //         }catch(err){
  //             logger.error(err);
  //             return {success:false}
  //         }
  //     },
  // };
}

module.exports = HansicService