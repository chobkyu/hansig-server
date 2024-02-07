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
    async writeReview(inputReview:Review,userInfo:Number,restaurantInfo:Number)
    {
        try{
        console.log(inputReview,userInfo,restaurantInfo);
        const success=await prisma.review.create({data:{review:inputReview.review,star:Number(inputReview.star),hansicsId:Number(restaurantInfo),userId:Number(userInfo),useFlag:true}});
        console.log(success);
        if(!success)
        {
            return {success:false};
        }
        if(inputReview.img){
            for(let i in inputReview.img)
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
    catch(err)
    {
        console.log(err);
    }
    }
    async updateReview(review:any):Promise<any>
    {
        return true;
    }
    async deleteReview(deleteReviewId:number,userInfo:number):Promise<any>
    {
        try{
            const success=await prisma.review.delete({where:{id:Number(deleteReviewId),userId:Number(userInfo)}});
            console.log(success);
            if(!success)
            {
                return {success:false};
            }
            return {success:true};
        }
        catch(err)
        {
            console.error(err);
        }
    }
}
module.exports=reviewService