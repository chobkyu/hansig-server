import { review, PrismaClient } from "@prisma/client";
import { Review } from "../interface/review/review";
import { success } from "../interface/success";
import { UserService } from "./user.service";
import { user } from "../interface/user/user";
import { Logger } from "winston";
const logger = new Logger();
const prisma = new PrismaClient();
class reviewService { 
  //해당 id의 한식당이 있는지 check
  async checkRestaurant(restaurantId:number):Promise<boolean>
  {try{
    const restaurant=await prisma.hansics.findUnique({where:{id:Number(restaurantId)}});
    console.log(restaurant);
    if(restaurant)
    {
      return true;
    }
    else
    {
      return false;
    }}
    catch(err)
    {
      logger.error(err);
      return false;
    }
  }
  //데이터 타입 체크
  checkReviewDTO(body:any)
  {try{
    if(Object.keys(body).length===3)
    {
      if(body.review && body.userData && body.star && typeof body.review==='string' && typeof body.star==='number')
      {
        return true;
      }
      return false;
    }
    else if(Object.keys(body).length===4)
    {
      if(body.review && body.userData && body.star && body.img && typeof body.review==='string' && typeof body.star==='number' && typeof body.img==='string')
      {
        return true;
      }
      return false;
    }
    else
    {
      return false;
    }
  }
    catch(err)
    {
      logger.error(err);
      return false;
    }
  }
  // 리뷰와 리뷰코멘트들(reviewComments),imgUrl들(reviewImgs.imgUrl)을 리턴받는다
  async getReview(id: number): Promise<any|false> {
    try {
      const review= await prisma.review.findUnique({
          select : {
            id:true,
            review : true,
            star : true,
            user : {select : {id : true, userNickName : true}},
            reviewComments:true,
        reviewImgs:{select:{imgUrl:true}}
          },
          where : {id : id}
        })
        //검색결과가 있으면
      if (review) {
        return review;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(err);
      return false;
    }
  }  
  //한식당의 id로 해당식당의 리뷰들과 각 리뷰들의 유저정보,(user.id,user.userNickName) 리뷰코멘트들(reviewComments),imgUrl들(reviewImgs.imgUrl)을 리턴받는다
  async getReviewList(restaurantId: number): Promise<any[]|any> {
    try {
      const review=await prisma.review.findMany({select : {
        id:true,
        review : true,
        star : true,
        user : {select : {id : true, userNickName : true}},
        reviewComments:true,
        reviewImgs:{select:{imgUrl:true}}
      },
      where : {hansicsId : restaurantId}})
       //검색결과가 있으면
      if (review) {
        return review;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
  // 리뷰작성
  async writeReview(inputReview: Review, userInfo: Number,
                    restaurantInfo: Number):Promise<boolean> 
  {
    try {
      const success = await prisma.review.create({
        data : {
          review : inputReview.review,
          star : Number(inputReview.star),
          hansicsId : Number(restaurantInfo),
          userId : Number(userInfo),
          useFlag : true
        }
      });
      if (!success) {
        return false;
      } // 리뷰 이미지 삽입
      // if (inputReview.img) {
      //   //이미지 배열 순회,수정필요
      //   for (let i in inputReview.img) {
      //     const img = await prisma.reviewImg.create(
      //         {data : {imgUrl : i, reviewId : success.id}});
      //     if (!img) {
      //       return false;
      //     }
      //   }
      // }
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
  async updateReview(inputReview: Review, userInfo: Number,
                     reviewInfo: Number): Promise<any|false> {
    try {
      const review =
          await prisma.review.findUnique({where : {id : Number(reviewInfo)}});
      if (review?.userId === Number(userInfo)) {
        const updatedReview = await prisma.review.update({
          data : {review : inputReview.review, star : inputReview.star},
          where : {id : Number(reviewInfo)}
        })
        // 새로운 이미지 삽입
        // if (inputReview.img) {
        //   for (let i in inputReview.img) {
        //     const img = await prisma.reviewImg.create(
        //         {data : {imgUrl : i, reviewId : updatedReview.id}});
        //     if (!img) {
        //       return false;
        //     }
        //   }
        // }
        const newReviewImage=await prisma.reviewImg.findMany({select:{imgUrl:true},where:{reviewId:updatedReview.id}});
        const ReviewComments=await prisma.reviewComment.findMany({where:{reviewId:updatedReview.id}});
        return {id:updatedReview.id,review:updatedReview.review,star:updatedReview.star,useFlag:updatedReview.useFlag,userId:updatedReview.userId,hansicsId:updatedReview.hansicsId,
          reviewComments:ReviewComments,reviewImgs:newReviewImage};
      } else {
        return false;
      }
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
  async deleteReview(deleteReviewId: number, userInfo: number): Promise<boolean> {
    try {
      const success = await prisma.review.delete(
          {where : {id : Number(deleteReviewId), userId : Number(userInfo)}});
      if (!success) {
        return false;
      }
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
}
module.exports = reviewService