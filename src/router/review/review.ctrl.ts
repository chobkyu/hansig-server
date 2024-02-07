import {PrismaClient} from "@prisma/client";
import express, {Express, Request, Response} from 'express';
import { UserService } from "../../service/user.service";
import { Login } from "../../interface/user/login";
const prisma = new PrismaClient();
const reviewServiceClass = require('../../service/review.service');
const reviewService = new reviewServiceClass();
const userService=new UserService();
const output={
    async getReview (req:Request,res:Response):Promise<any>
    {
        const review=await reviewService.getReview(req.params.id);
        if(review)
        {
            return res.json({data:review});
        }
        else
        {
            return res.status(204).end();
        }
    },
    async getReviewList (req:Request,res:Response):Promise<any>
    {
        const reviewList=await reviewService.getReviewList(req.params.id);
        if(reviewList)
        {
            return res.json({data:reviewList});
        }
        else
        {
            return res.status(204).end();
        }
    }
}
const process=
{
    async writeReview (req:Request,res:Response):Promise<any>
    {
        const userInfo=req.body.userData;
        const reviewId=req.params.id;
        const isSuccess=await reviewService.writeReview(req.body,userInfo.id,reviewId);
        if(isSuccess.success)
        {
            return res.status(201).end();
        }
        else
        {
            return res.status(404).end();
        }
    },
    async updateReview (req:Request,res:Response):Promise<any>
    {
        const isSuccess=await reviewService.updateReview(req.body);
        if(isSuccess)
        {
            return res.status(201).end();
        }
    },
    async deleteReview (req:Request,res:Response):Promise<any>
    {
        const isSuccess=await reviewService.deleteReview(req.params.id,req.body.userData.id);
        if(isSuccess.success)
        {
            return res.status(204).end();
        }
        else
        {
            return res.status(404).end();
        }
    }
}
module.exports = {
    output,
    process
  }