import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from 'express';
const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});
const hansicServiceClass = require('../../service/hansic.service');
const hansicService = new hansicServiceClass();
const logger = require('../../util/winston');

const output = {
  //전체조회
  getAll: async (req: Request, res: Response) => {
    try {
      const response = await hansicService.getAll();
      //유효한 검색 결과가 있는지 확인
      if (response) {
        return res.json({ data: response });
      } else {
        return res.status(204).end();
      }
    }
    catch (err) {
      logger.error(err);
      return res.status(500).end();
    }
  },
  //id로 단일 식당 조회
  get: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      //id가 숫자인지 확인
      if (isNaN(id)) {
        return res.status(400).end();
      } else {
        let userId = 0;
        //로그인되어있는지 확인
        if (req.body.userData) {
          userId = req.body.userData.id;
        }
        const response = await hansicService.get(id, userId);
        //유효한 검색 결과가 있는지 확인
        if (response) {
          response.count = Number(response.count);
          return res.json({ data: response });
        } else {
          return res.status(400).end();
        }
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).end();
    }
  },

  //지역 id로 지역내 식당조회
  getFromLocation: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      console.log(id);
      //로그인되어있는지 확인
      if (isNaN(id)) {
        return res.status(400).end();
      } else {
        //유효한 지역값인지 확인
        if ((id > 0) && (id < 13)) {
          const response = await hansicService.getFromLocation(id);
          //유효한 검색 결과가 있는지 확인
          if (response) {
            return res.json({ data: response });
          } else {
            return res.status(404).end();
          }
        } else {
          return res.status(400).end();
        }
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).end();
    }
  },

  //주소 -> 좌표 변환
  tryGeo: async (req: Request, res: Response) => {
    try {
      console.log('ctrl');
      const response = await hansicService.convert();
      return res.json(response).end();
    } catch (err) {
      logger.error(err);
      return res.status(500).end();
    }
  },

  //좌표를 쿼리로 받아 검색
  getByPlace: async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat;
      const lng = req.query.lng;
      let userId = 0;
      //로그인되어있는지 확인
      if (req.body.userData) {
        userId = req.body.userData.id;
      }

      console.log(userId);
      const response = await hansicService.getByPlace(Number(lat), Number(lng), userId);
      //유효한 검색 결과가 있는지 확인
      if (response) {
        return res.json({ data: response });
      }
      else {
        return res.status(404).end();
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).end();
    }
  },

  //유저 별 즐겨찾는 한뷔 조회
  favorite : async (req: Request, res: Response) => {
    try{
      const response = await hansicService.getUserFavorite(req.body.userData.id);

      return res.json(response).end();
    }catch(err){
      logger.error(err);
      return res.status(500).end();
    }
  }
  // create:async(req:Request,res:Response)=>
  // {
  //     const restaurantId= req.params.id;
  //     const response=await hansicService.create(restaurantId,req);
  //     return res.status(201);
  // },
  // menu:{
  //     getAll :async (req:Request,res:Response) => {
  //         const response = await hansicService.menu.getAll();
  //         if(response.success) return res.json(response);
  //         else return res.status(500);
  //     },
  //     get:async (req:Request,res:Response) => {
  //         const response = await
  //         hansicService.menu.get(parseInt(req.params.id));
  //         if(response.success) return res.json(response);
  //         else if(res.locals.errmsg)
  //         {
  //             return res;
  //         }
  //         else{return res.status(500);}

  //     }
  // }
}

const process = {
  favorite: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id); //한식 뷔페 아이디

      //유효하지 않은 id
      if (isNaN(id)) {
        return res.status(400).end();
      }

      const response = await hansicService.favorite(id, req.body);
      console.log(response);

      return res.status(response.status).end();

    } catch (err) {
      logger.error(err);
      return res.status(500).end();
    }
  }
}

module.exports = {
  output,
  process
}