import {PrismaClient} from "@prisma/client";
import express, {Express, Request, Response} from 'express';
const prisma = new PrismaClient();
const hansicServiceClass = require('../../service/hansic.service');
const hansicService = new hansicServiceClass();
const output = {
  getAll : async (req: Request, res: Response) => {
    try{
    const response =await hansicService.getAll();
    if (response){
      return res.json({data:response});
    }
    else{
      return res.status(204).end();
    }}
    catch(err)
    {
      return res.status(500).end();
    }
  },
  get : async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).end();
      } else {
        const response = await hansicService.get(id);
        if(response){
         return res.json({data:response});
        }
        else
        {
          return res.status(400).end();
        }
    }
    } catch (err) {
      return res.status(500).end();
    }
  },
  getFromLocation : async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      console.log(id);
      if (isNaN(id)) {
        return res.status(400).end();
      } else {
        if ((id > 0) && (id < 13)) {
          const response = await hansicService.getFromLocation(id);
          return res.json({data:response});
        } else {
          return res.status(400).end();
        }
      }
    } catch (err) {
      return res.status(500).end();
    }
  },
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

const process =
    {

}

    module.exports = {
      output,
      process
    }