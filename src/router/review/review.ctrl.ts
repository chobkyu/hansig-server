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
        }
    },
    //식당id로 리뷰리스트 얻어오기
    async getReviewList(req: Request, res: Response): Promise<any> {
        try {
            const reviewList = await reviewService.getReviewList(Number(req.params.id));
            //검색결과가 있으면
            if (reviewList) {
                console.log(reviewList);
                return res.json(reviewList);
            }
            else {
                return res.status(204).end();
            }
        }
        catch (err) {
            logger.error(err);
        }
    }
}
const process = {
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
            } else {
                return res.status(400).end();
            }
        } catch (err) {
            logger.error(err);
        }
    },
    async deleteReview(req: Request, res: Response): Promise<any> {
        try {
            const isSuccess = await reviewService.deleteReview(req.params.id, req.body.userData.id);
            if (isSuccess) {//삭제성공시
                return res.status(204).end();
            } else {
                return res.status(404).end();
            }
        } catch (err) {
            logger.error(err);
        }
    }
}
module.exports = {
    output,
    process
}