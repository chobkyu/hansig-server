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
        try{console.log("getReview");
        const review=await reviewService.getReview(Number(req.params.id));
        console.log(review);
        if(review)
        {
            return res.json({data:review});
        }
        else
        {
            return res.status(404).end();
        }}
        catch(err)
        {
            console.error(err);
        }
    },
    async getReviewList (req:Request,res:Response):Promise<any>
    {
        console.log("getReviewList");
        const reviewList=await reviewService.getReviewList(Number(req.params.id));
        if(reviewList)
        {
            return res.json(reviewList);
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
        console.log("writeReview");
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
    {console.log("updateReview");
        const isSuccess=await reviewService.updateReview(req.body);
        if(isSuccess)
        {
            return res.status(201).end();
        }
    },
    async deleteReview (req:Request,res:Response):Promise<any>
    {console.log("deleteReview");
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