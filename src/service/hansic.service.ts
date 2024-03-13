import {hansics, PrismaClient} from "@prisma/client";

import {favoriteDto} from "../interface/hansic/favorite";
import { EnrollHansicDto } from "../interface/hansic/enrollHansic";

const request = require('request');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
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

export class HansicService {
  async getHansicDate() {
    try {
      const data = await prisma.hansics.findMany({include : {location : true}});
      return { data, success: true }
    } catch (err) {
      logger.error(err);
      return { success: false }
    }
  }
  // 좌표로 조회
  async getByPlace(lat: Number, lng: Number, userId?: Number) {
    try {
      // 좌표로 단일 검색
      const data = await prisma.$queryRaw<any[]>`
        SELECT 
          hs.id,
          hs.name,
          hs.addr,
          hs.google_star,
          hs.location_id,
          hs.lat,
          hs.lng,
          ls.location,
          si."imgUrl",
          rd.count,
          rd."userStar"
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId"
        LEFT JOIN (
          SELECT 
            rv."hansicsId",
            COUNT(*) as count,
            AVG(star) as "userStar" 
          FROM hansic.review as rv 
          GROUP BY rv."hansicsId"
        ) as rd
        on hs.id=rd."hansicsId"
        WHERE hs.lat=${lat} or hs.lng=${lng} 
      `;

      // user정보가 넘어왔을시 favorite확인

      let favorite;

      if (userId) {
        let findStar = await prisma.favorites.findFirst(
            {where : {userId : Number(userId), hansicsId : data[0].id}});

        favorite = findStar?.useFlag == null ? false : findStar.useFlag;
      } else {
        // 유저정보가 넘어오지 않은경우
        favorite = false;
      }

      if (data.length > 0) {
        data[0].count = Number(data[0].count);
        // 즐겨찾기 되어 있으면 true
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
  // 식당id로 단일 조회
  async get(restaurantId: number, userId?: number): Promise<Object|false> {
    try {
      let favorite;
      const data = await prisma.$queryRaw<any[]>`
        SELECT
          hs.id,
          hs.name,
          hs.addr,
          hs.google_star,
          hs.location_id,
          hs.lat,
          hs.lng,
          ls.location,
          si."imgUrl",
          rd.count,
          rd."userStar"
        FROM hansic.hansics as hs 
        INNER JOIN hansic.location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN hansic."sicdangImg" as si 
        on hs.id=si."hansicsId" 
        LEFT JOIN (
          SELECT 
            rv."hansicsId",
            COUNT(*) as count,
            AVG(star) as "userStar"
          FROM hansic.review as rv 
              GROUP BY rv."hansicsId"
          ) as rd on hs.id=rd."hansicsId"
        where lat != 0 AND hs.id=${restaurantId}
        ORDER BY hs.id ASC
      `;
      // user정보가 넘어왔을시 favorite확인
      if (userId) {
        let findStar = await prisma.favorites.findFirst(
            {where : {userId : Number(userId), hansicsId : data[0].id}});
        favorite = findStar?.useFlag == null ? false : findStar.useFlag;
      } else {
        // 유저정보가 넘어오지 않은경우
        favorite = false;
      }
      if (data.length > 0) {
        data[0].count = Number(data[0].count);
        // 즐겨찾기 되어 있으면 true
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
  // 지역id로 지역내 식당리스트 조회
  async getFromLocation(locationId: number,sortby?:number): Promise<any[]|false> {
    try {let data;
      if(sortby){
      data = await prisma.$queryRaw<any[]>`
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
        LEFT JOIN (
          SELECT 
            rv."hansicsId",
            COUNT(*) as count,
      AVG(star) as "userStar"
          FROM hansic.review as rv 
          GROUP BY rv."hansicsId"
        ) as rd on hs.id=rd."hansicsId" 
        WHERE hs.location_id=${locationId} 
        ORDER BY rd."userStar" DESC NULLS LAST
      `;}
      else
      {
        data = await prisma.$queryRaw<any[]>`
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
        LEFT JOIN (
          SELECT 
            rv."hansicsId",
            COUNT(*) as count,
      AVG(star) as "userStar"
          FROM hansic.review as rv 
          GROUP BY rv."hansicsId"
        ) as rd on hs.id=rd."hansicsId" 
        WHERE hs.location_id=${locationId} 
        ORDER BY rd.count DESC NULLS LAST
      `;
      }
      data=data.map(item => ({
        ...item,
        count: item.count?item.count.toString():null, // BigInt 필드를 문자열로 변환
      }));
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
  // 전체조회
  async getAll(sortby?:number): Promise<any[]|false> {
    try {
      let data;
      if(sortby)
      {
        data = await prisma.$queryRaw<any[]>`
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
          rd.count,
          rd."userStar"
        FROM hansics as hs 
        INNER JOIN location as ls 
        on hs.location_id=ls.id 
        LEFT JOIN "sicdangImg" as si 
        on hs.id=si."hansicsId" 
        LEFT JOIN (
          SELECT 
            rv."hansicsId",
            COUNT(*) as count,
          AVG(star) as "userStar"
          FROM review as rv 
          GROUP BY rv."hansicsId"
        ) as rd on rd."hansicsId"=hs.id 
        where lat != 0
        ORDER BY rd."userStar" DESC NULLS LAST
        `;
      }
      else
      {
        data = await prisma.$queryRaw<any[]>`
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
            rd.count,
            rd."userStar"
          FROM hansics as hs 
          INNER JOIN location as ls 
          on hs.location_id=ls.id 
          LEFT JOIN "sicdangImg" as si 
          on hs.id=si."hansicsId" 
          LEFT JOIN (
            SELECT 
              rv."hansicsId",
              COUNT(*) as count,
            AVG(star) as "userStar"
            FROM review as rv 
            GROUP BY rv."hansicsId"
          ) as rd on rd."hansicsId"=hs.id 
          where lat != 0
          ORDER BY rd.count DESC NULLS LAST
        `;
      }
      
      data=data.map(item => ({
        ...item,
        count: item.count?item.count.toString():null, // BigInt 필드를 문자열로 변환
      }));
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

  // 주소 -> 좌표 변환
  async convert() {
    try {
      const response: any = await this.getAll();
      // logger.info(response);
      for (var i = 0; i < response.length; i++) {
        // logger.info(response[i].addr);

        if (response[i].addr != '주소 없음') {
          await this.tryGeo(response[i])
        }
      }
      return {success : true};
    } catch (err) {
      logger.error(err);
      return {success : false};
    }
  }

  // kakao api 호출, 주소 -> 좌표 변환
  async tryGeo(hansic: any) {
    try {
      const addr = hansic.addr
      const option = {
        uri : 'https://dapi.kakao.com/v2/local/search/address',
        qs : {query : addr},
        headers : {Authorization : `KakaoAK ${process.env.kakao_api}`}
      }

      // 카카오 api 호출
      request(option, async (err: any, response: any, body: any) => {
        const obj = JSON.parse(body);

        if (!obj["documents"]?.length) {
          // logger.info('can not find address');
        } else {
          // logger.info(obj["documents"][0].x) // lng
          // logger.info(obj["documents"][0].y) // lat
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

  // 좌표 데이터베이스에 저장
  async updateGeo(id: number, lng: number, lat: number) {
    try {
      const updateHansics = await prisma.hansics.update({
        where : {
          id : id,
        },
        data : {
          lat : lat,
          lng : lng,
        }
      });

      return {success : true};
    } catch (err) {
      logger.error(err);
      return {success : false};
    }
  }

  /**
   * 유저 별 한뷔 즐겨찾는 목록 조회
   * @param id 유저 아이디
   * @returns //테스트 코드 참조
   */
  async getUserFavorite(id : number) {
    try{
      const favoriteList = await prisma.user.findFirst({
        where:{
          id:id
        },
        select : {
          userId:true,
          userNickName:true,
          favorites : {
            where : { useFlag:true,},
            include :{
              hansics : {
                select:{
                  name : true,
                  addr : true,
                  google_star :true,
                  userStar :true,
                  id : true,
                  lat : true,
                  lng : true,
                  location:true,
                  location_id:true,
                  sicdangImgs : {
                    select : { imgUrl :true, }
                  }
                }
              }
            }
          }
        }
      });

      return favoriteList;
    }catch(err){
      logger.error(err);
      return {success:false, status:500};
    }
  }


  /**
   * 즐겨찾기 추가
   * @param hansicId 즐겨찾는 한식 식당 아이디
   * @param body 유저 정보 
   * @returns {success:boolean,status:number}
   */
  async favorite(hansicId: number, body: favoriteDto) {
    try {

      const findHansic = await this.get(hansicId);
      if (!findHansic)
        return {success : false, status : 404} // transaction
        prisma.$transaction(async (tx) => {
          const selectFavorite = await tx.favorites.findFirst({
            where : {
              userId : body.userData.id,
              hansicsId : hansicId,
            }
          });

          if (selectFavorite != null) {
            // 즐겨찾기 데이터가 있을 시 update

            const updateFavoite = selectFavorite.useFlag == true
                                      ?

                                      await tx.favorites.update({
                                        where : {id : selectFavorite.id},
                                        data : {useFlag : false}
                                      })
                                      :

                                      await tx.favorites.update({
                                        where : {id : selectFavorite.id},
                                        data : {useFlag : true}
                                      });
          } else {
            // 즐겨찾기 데이터가 없을 시 insert
            const insertFavorite = await tx.favorites.create({
              data : {
                userId : body.userData.id,
                hansicsId : hansicId,
              }
            });
          }
        });

      return {success : true, status : 201};

    } catch (err) {
      logger.error(err);
      return {success : false, status : 500};
    }
  }

  async enrollHansic (body:EnrollHansicDto){
    try{
      const check = this.checkEnrollDto(body);

      if(!check) return {success:false, status:400};

      await prisma.enrollHansic.create({
        data : {
          name : body.name,
          addr : body.addr,
          location_id : body.location,
          userId : body.userData.id,
        }
      });

      return {success:true, status:201};
    }catch(err){
      console.log(err);
      logger.error(err);
      return {success : false, status : 500};
    }
  }

  checkEnrollDto(body:any){
    try{
      if(body.name && body.addr && body.location && body.imgUrl &&
        typeof body.name === 'string' && typeof body.addr === 'string' && 
        typeof body.location ==='number' && typeof body.imgUrl ==='string'){
          return Object.keys(body).length === 5 ?  true : false;
      }else{
        return false;
      }
    }catch(err){
      logger.error(err);
      return false;
    }
  }
}

module.exports = HansicService