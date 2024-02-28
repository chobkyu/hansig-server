import {PrismaClient, review} from "@prisma/client";
import {Logger} from "winston";
import { ReviewUpdate } from "../interface/review/reviewUpdate";
import {Review} from "../interface/review/review";
import {success} from "../interface/success";
import {user} from "../interface/user/user";

import {UserService} from "./user.service";

const logger = new Logger();
const prisma = new PrismaClient();
class reviewService {
  // 해당 id의 한식당이 있는지 check
  async checkRestaurant(restaurantId: number): Promise<boolean> {
    try {
      const restaurant = await prisma.hansics.findUnique(
          {where : {id : Number(restaurantId)}});
      if (restaurant) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
  // 데이터 타입 체크
  checkReviewDTO(body: any) {
    try {
      if (Object.keys(body).length === 3) {
        if (body.review && body.userData && body.star &&
            typeof body.review === 'string' && typeof body.star === 'number') {
          return true;
        }
        return false;
      } else if (Object.keys(body).length === 4) {
        if (body.review && body.userData && body.star && body.img &&
            typeof body.review === 'string' && typeof body.star === 'number' &&
            typeof body.img === 'string') {
          return true;
        }
        return false;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
  // 리뷰와 리뷰코멘트들(reviewComments),imgUrl들(reviewImgs.imgUrl)을
  // 리턴받는다
  async getReview(id: number): Promise<any> {
    try {
      const review = await prisma.review.findUnique({
        select : {
          id : true,
          review : true,
          star : true,
          user : {select : {id : true, userNickName : true}},
          reviewComments : true,
          reviewImgs : {select : {imgUrl : true}},
          useFlag:true
        },
        where : {id : id}
      })
      // 검색결과가 있으면
      if (review) {
        return {success:true,review:review};
      }
      else {
        return {success:false};
      }
    } catch (err) {
      logger.error(err);
      return {success:false};
    }
  }
  // 한식당의 id로 해당식당의 리뷰들과 각 리뷰들의
  // 유저정보,(user.id,user.userNickName)
  // 리뷰코멘트들(reviewComments),imgUrl들(reviewImgs.imgUrl)을 리턴받는다
  async getReviewList(restaurantId: number): Promise<any[]|any> {
    try {
      const review = await prisma.review.findMany({
        select : {
          id : true,
          review : true,
          star : true,
          user : {select : {id : true, userNickName : true}},
          reviewComments : true,
          reviewImgs : {select : {imgUrl : true}},
          useFlag:true
        },
        where : {hansicsId : restaurantId}
      })
      // 검색결과가 있으면
      if (review) {
        return {success:true,reviewList:review};
      }
      else {
        return {success:false};
      }
    } catch (err) {
      logger.error(err);
      return {success:false};
    }
  }
  // 리뷰작성
  /*interface Review {
    review : string,
    star : number,
    img? : Array<string>
}
   */
  async writeReview(inputReview: Review, userInfo: Number,
                    restaurantInfo: Number): Promise<any> {
    try {
      let success;
      //img가 있는지 확인
      if(inputReview.img){
        success=await prisma.$transaction(async(tx)=>
        {
          const create=await tx.review.create({
            data : {
              review : inputReview.review,
              star : Number(inputReview.star),
              hansicsId : Number(restaurantInfo),
              userId : Number(userInfo),
              useFlag : true
            }
          });
          const imgData:any=inputReview.img?.map(imgUrl => ({
            imgUrl,
            reviewId:create.id,
          }));
          if(imgData){
          const image=await tx.reviewImg.createMany({data:imgData});
          }
      });
    }
      else
      {
        success = await prisma.review.create({
          data : {
            review : inputReview.review,
            star : Number(inputReview.star),
            hansicsId : Number(restaurantInfo),
            userId : Number(userInfo),
            useFlag : true
          }
        });
      }
      
      if (!success) {
        return {success:false};
      } 
      return {success:true};
    } catch (err) {
      logger.error(err);
      return {success:false};
    }
  }
  /*
  interface ReviewUpdate {
    review : string,
    star : number,
    insertImg? : Array<string>,
    deleteImg?:Array<number>,
}insertImg는 업로드할 imgurl,deleteimg는 삭제할 reviewimg의 id의 array
userinfo는 유저id,reviewinfo역시 review의 id.
  */
  async updateReview(inputReview: ReviewUpdate, userInfo: number,
                     reviewInfo: number): Promise<any> {
    try {
      let updatedReview:any,insertImg:any,deleteImg:any;
      updatedReview=undefined;
      //review가 있는지 체크
      const review =
          await prisma.review.findUnique({where : {id : reviewInfo,useFlag:true}});
          //원저작자인지 확인
          const user=await prisma.user.findUnique({select:{id:true,userNickName:true},where : {id : userInfo}});
      if (review?.userId === userInfo) {
        if(inputReview.insertImg)//삽입할 이미지가 있는지 확인
        {//img array를 분리대입.
          insertImg=inputReview.insertImg?.map(imgUrl => ({
            imgUrl,
            reviewId:reviewInfo
          }));
        }//삭제할 img확인
          if(inputReview.deleteImg)
          {//삭제할 img id를 분리
            deleteImg=inputReview.deleteImg?.map(id => ({
              id
            }));
          }
          //트랜잭션
  await prisma.$transaction(async (tx)=>{       
        updatedReview = await tx.review.update({
          data : {review : inputReview.review, star : inputReview.star},
          where : {id : reviewInfo}
        });
        if(insertImg){
        await tx.reviewImg.createMany({data:insertImg});
      }
      if(deleteImg)
      {
        await tx.reviewImg.deleteMany({where:{id:deleteImg.id}});
      }
  });
  if(updatedReview){
            //수정후 이미지
            const newReviewImage = await prisma.reviewImg.findMany(
            {select : {imgUrl : true}, where : {reviewId : reviewInfo}});
            //리뷰 코멘트
        const ReviewComments = await prisma.reviewComment.findMany(
            {where : {reviewId : reviewInfo}});
        return {
          success:true,
          id : updatedReview.id,
          review : updatedReview.review,
          star : updatedReview.star,
          useFlag : updatedReview.useFlag,
          userId : updatedReview.userId,
          hansicsId : updatedReview.hansicsId,
          reviewComments : ReviewComments,
          reviewImgs : newReviewImage,
          user:user
        };
      }
      else//updatedReview가 실패한경우.
      {
        return {success:false};
      }
      } else {//작성자가 아닌경우
        return {success:false,status:403};
      }
    } catch (err) {
      logger.error(err);
      return {success:false,status:500};
    }
  }
  //soft delete
  async deleteReview(deleteReviewId: number,
                     userInfo: number): Promise<any> {
    try {
       const success = await prisma.review.update(
          {data:{useFlag:false},where : {id : deleteReviewId, userId : userInfo}});
      if (!success) {
        return{success:false};
      }
      return {success:true};
    } catch (err) {
      logger.error(err);
      return {success:false};
    }
  }
}
module.exports = reviewService