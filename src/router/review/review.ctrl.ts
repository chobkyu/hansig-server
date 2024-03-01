import {PrismaClient} from "@prisma/client";
import express, {Express, Request, Response} from 'express';
import { UserService } from "../../service/user.service";
import { Login } from "../../interface/user/login";
import { Logger } from "winston";
const logger=new Logger();
const prisma = new PrismaClient();
const reviewServiceClass = require('../../service/review.service');
const reviewService = new reviewServiceClass();
const userService=new UserService();
const output={
    //리뷰id로 리뷰 얻어오기
    async getReview (req:Request,res:Response):Promise<any>
    {
        try{
        const reviewId=Number(req.params.id);
        if(reviewId){
        const review=await reviewService.getReview(reviewId);
        if(review.success)//검색결과가 있으면
        {
            return res.json({data:review.review});
        }
        else
        {
            return res.status(404).end();
        }
        }
        else
        {
            return res.status(400).end();
        }
       }
        catch(err)
        {
            logger.error(err);
            return res.status(500).end();
        }
    },
    //식당id로 리뷰리스트 얻어오기
    async getReviewList (req:Request,res:Response):Promise<any>
    {
        try{
        const reviewList=await reviewService.getReviewList(Number(req.params.id));
        //검색결과가 있으면
        if(reviewList.success)
        {
            return res.json(reviewList.reviewList);
        }
        else {
            return res.status(204).end();
        }}
        catch(err)
        {
            logger.error(err);
            return res.status(500).end();
        }
    }
}
const process =
{
    async writeReview (req:Request,res:Response):Promise<any>
    {
        try{
        const userInfo=req.body.userData;
        const restaurantId=req.params.id;
        //리뷰를 쓸 한식당이 있는지 확인
        const checkRestaurant=await reviewService.checkRestaurant(restaurantId);
        if(checkRestaurant){
        //데이터 양식이 맞는지 확인
        const checkDTO=reviewService.checkReviewDTO(req.body);
        if(checkDTO){
        //리뷰 작성
        const isSuccess=await reviewService.writeReview(req.body,userInfo.id,restaurantId);
        if(isSuccess.success)//작성성공시
        {
            return res.status(201).end();
        }
        else
        {
            return res.status(404).end();
        }}
        else
        {
            return res.status(400).end();
        }
    }
    else
    {
        return res.status(404).end();
    }

    }
        catch(err)
        {
            logger.error(err);
            return res.status(500).end();
        }
    },
    async updateReview (req:Request,res:Response):Promise<any>
    {
        try{
        const userInfo=req.body.userData;
        const reviewId=req.params.id;
        if(userInfo && Number(reviewId)){
        const updatedReview=await reviewService.updateReview(req.body,userInfo.id,Number(reviewId));
        if(updatedReview.success)//update성공시
        {
            return res.json(updatedReview).end();
        }
        else
        {
            if(updatedReview.status)
            {
                return res.status(updatedReview.status).end();
            }
            return res.status(500).end();
        }
        }
        else
        {
            return res.status(400).end();
        }
    }catch(err)
        {
            logger.error(err);
            return res.status(500).end();
        }
    },
    async deleteReview (req:Request,res:Response):Promise<any>
    {
        try{
        const isSuccess=await reviewService.deleteReview(Number(req.params.id),req.body.userData.id);
        if(isSuccess.success)//삭제성공시
        {
            return res.status(204).end();
        }
        else
        {
            if(isSuccess.status)
            {
                return res.status(isSuccess.status).end();
            }
            return res.status(404).end();
        }}catch(err:any)
        {
            logger.error(err);
            if(err.status)
            {
                return res.status(err.status).end();
            }
            return res.status(500).end();
        }
    }
}
module.exports = {
    output,
    process
}