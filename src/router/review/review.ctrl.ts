import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from 'express';
const prisma = new PrismaClient();
const reviewServiceClass = require('../../service/review.service');
const reviewService = new reviewServiceClass();
const output = {
    async getReview(req: Request, res: Response): Promise<any> {
        const review = await reviewService.getReview(req.params.id);
        if (review) {
            return res.json({ data: review });
        }
        else {
            return res.status(204).end();
        }
    },
    async getReviewList(req: Request, res: Response): Promise<any> {
        const reviewList = await reviewService.getReviewList(req.params.id);
        if (reviewList) {
            return res.json({ data: reviewList });
        }
        else {
            return res.status(204).end();
        }
    }
}
const process =
{
    async writeReview(req: Request, res: Response): Promise<any> {
        const isSuccess = await reviewService.writeReview(req.body);
        if (isSuccess) {
            return res.status(201).end();
        }
    },
    async updateReview(req: Request, res: Response): Promise<any> {
        const isSuccess = await reviewService.updateReview(req.body);
        if (isSuccess) {
            return res.status(201).end();
        }
    },
    async deleteReview(req: Request, res: Response): Promise<any> {
        const isSuccess = await reviewService.deleteReview(req.body);
        if (isSuccess) {
            return res.status(201).end();
        }
    }
}
module.exports = {
    output,
    process
}