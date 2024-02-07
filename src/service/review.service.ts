import { review, PrismaClient } from "@prisma/client";
import { Review } from "../interface/review/review";
import { success } from "../interface/success";
import { UserService } from "./user.service";
import { user } from "../interface/user/user";
const prisma = new PrismaClient();
class reviewService
{//리뷰 아이디로 리뷰조회
    async getReview(id:number):Promise<any>
    {
        const review=await prisma.review.findUnique({where:{id:id}});
        if(review)
        {
            return review;
        }
        else
        {
            return false;
        }
        return true;
    }//식당 id로 리뷰조회
    async getReviewList(restaurantId:number):Promise<any>
    {
        return true;
    }
    //리뷰작성
    async writeReview(inputreview:Review,userInfo:number,restaurantInfo:number):Promise<success>
    {
        const success=await prisma.review.create({data:{review:inputreview.review,star:inputreview.star,hansicsId:restaurantInfo,userId:userInfo}});
        if(!success)
        {
            return {success:false};
        }
        if(inputreview.img){
            for(let i in inputreview.img)
            {
                const img=await prisma.reviewImg.create({data:{imgUrl:i,reviewId:success.id}});
                if(!img)
                {
                    return {success:false};
                }
            }
        }
        return {success:true};
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