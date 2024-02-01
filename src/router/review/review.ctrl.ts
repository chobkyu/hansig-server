import {PrismaClient} from "@prisma/client";
import express, {Express, Request, Response} from 'express';
const prisma = new PrismaClient();
const reviewServiceClass = require('../../service/review.service');
const reviewService = new reviewServiceClass();
const output={
    async getReview (req:Request,res:Response):Promise<any>
    {
        
    },
    async getReviewList (req:Request,res:Response):Promise<any>
    {
    }
}
const process=
{
    async writeReview (req:Request,res:Response):Promise<any>
    {
        
    },
    async updateReview (req:Request,res:Response):Promise<any>
    {
        
    },
    async deleteReview (req:Request,res:Response):Promise<any>{}
}
module.exports = {
    output,
    process
  }