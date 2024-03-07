import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from 'express';
import { UserService } from "../../service/user.service";
import { Login } from "../../interface/user/login";
import { Logger } from "winston";
const logger = new Logger();
const prisma = new PrismaClient();
const reviewServiceClass = require('../../service/review.service');
const reviewService = new reviewServiceClass();
const userService = new UserService();
const output = {
    //리뷰id로 리뷰 얻어오기
    async getReview(req: Request, res: Response): Promise<any> {
        try {
            const review = await reviewService.getReview(Number(req.params.id));
            if (review)//검색결과가 있으면
            {
                return res.json({ data: review });
            }
            else {
                return res.status(404).end();
            }
        }
        catch (err) {
            logger.error(err);
            return res.status(500).end();
        }
    },
    //식당id로 리뷰리스트 얻어오기
    async getReviewList(req: Request, res: Response): Promise<any> {
        try {
            const reviewList = await reviewService.getReviewList(Number(req.params.id));
            //검색결과가 있으면
            if (reviewList) {
                return res.json(reviewList);
            }
            else {
                return res.status(204).end();
            }
        }
        catch (err) {
            logger.error(err);
            return res.status(500).end();
        }
    },

    //유저 별 리스트 조회
    async userList(req:Request, res:Response) {
        try{
            const id = req.body.userData.id;
            const response = await reviewService.getUserReviewList(id);

            if(!response.success) {
                return res.status(response.status).end();
            }

            return res.json(response.reviewList);
        }catch(err){
            logger.error(err);
            return res.status(500).end();
        }
    }
}
const process =
{
    async writeReview(req: Request, res: Response): Promise<any> {
        try {
            const userInfo = req.body.userData;
            const reviewId = req.params.id;
            const isSuccess = await reviewService.writeReview(req.body, userInfo.id, reviewId);
            if (isSuccess)//작성성공시
            {
                return res.status(201).end();
            }
            else {
                return res.status(404).end();
            }
        }
        catch (err) {
            logger.error(err);
            return res.status(500).end();
        }
    },
    async updateReview(req: Request, res: Response): Promise<any> {
        try {
            const userInfo = req.body.userData;
            const reviewId = req.params.id;
            const updatedReview = await reviewService.updateReview(req.body, userInfo.id, reviewId);
            if (updatedReview)//update성공시
            {
                updatedReview.user = {};
                updatedReview.user.id = userInfo.id;
                updatedReview.user.userNickName = userInfo.userNickName;
                return res.json(updatedReview);
            }
            else {
                return res.status(400).end();
            }
        } catch (err) {
            logger.error(err);
            return res.status(500).end();
        }
    },
    async deleteReview(req: Request, res: Response): Promise<any> {
        try {
            const isSuccess = await reviewService.deleteReview(req.params.id, req.body.userData.id);
            if (isSuccess)//삭제성공시
            {
                return res.status(204).end();
            }
            else {
                return res.status(404).end();
            }
        } catch (err:any) {
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