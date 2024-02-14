import { review, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class reviewService
{
    async getReview(id:number):Promise<any>
    {
        return true;
    }
    async getReviewList(id:number):Promise<any>
    {
        return true;
    }
    async writeReview(review:any):Promise<any>
    {
        return true;
    }
    async updateReview(review:any):Promise<any>
    {
        return true;
    }
    async deleteReview(review:any):Promise<any>
    {
        return true;
    }
}
module.exports=reviewService