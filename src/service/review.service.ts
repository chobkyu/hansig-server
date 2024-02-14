import { review, PrismaClient } from "@prisma/client";
import { Review } from "../interface/review/review";
import { success } from "../interface/success";
import { UserService } from "./user.service";
import { user } from "../interface/user/user";
const prisma = new PrismaClient();
class reviewService { // 리뷰 아이디로 리뷰조회
  async getReview(id: number): Promise<any|false> {
    try {
        //id에 해당하는 리뷰,해당 리뷰의 리뷰코멘트,해당리뷰의 리뷰이미지 리턴
      const [review, reviewComment, reviewImg] = await Promise.all([
        prisma.review.findUnique({
          select : {
            review : true,
            star : true,
            user : {select : {id : true, userNickName : true}}
          },
          where : {id : id}
        }),
        prisma.reviewComment.findMany({where : {reviewId : id}}),
        prisma.reviewImg.findMany(
            {select : {imgUrl : true}, where : {reviewId : id}})
      ]);
      console.log(review, reviewComment, reviewImg);
      if (review) {
        return {
          review : review.review,
          star : review.star,
          user : review.user,
          reviewComment : reviewComment,
          imgUrl : reviewImg
        };
      } else {
        return false;
      }
    } catch (err) {
      console.log("err");
    }
  } // 식당 id로 리뷰조회
  async getReviewList(restaurantId: number): Promise<any[]|any> {
    try {
      // 리뷰와 리뷰로 group by된 리뷰코멘트들(string),imgUrl들(string)을
      // 리턴받는다
      const review = await prisma.$queryRaw<any[]>`SELECT 
        rv.id,
        rv.star,
        rv.review,
         STRING_AGG(rc.comment, ', ') AS comment,
         STRING_AGG(ri."imgUrl", ', ') AS "imgUrl"
        FROM hansic.review as rv
        LEFT JOIN hansic."reviewComment" as rc ON  rv.id=rc."reviewId"
        LEFT JOIN hansic."reviewImg"as ri ON rv.id=ri."reviewId"
        WHERE rv."hansicsId"=${restaurantId}
        GROUP BY rv.id`;
      if (review) {
        console.log(review);
        return review;
      } else {
        return false;
      }
    } catch (err) {
    }
  }
  // 리뷰작성
  async writeReview(inputReview: Review, userInfo: Number,
                    restaurantInfo: Number) {
    try {
      console.log(inputReview, userInfo, restaurantInfo);
      const success = await prisma.review.create({
        data : {
          review : inputReview.review,
          star : Number(inputReview.star),
          hansicsId : Number(restaurantInfo),
          userId : Number(userInfo),
          useFlag : true
        }
      });
      console.log(success);
      if (!success) {
        return {success : false};
      } // 리뷰 이미지 삽입
      if (inputReview.img) {
        for (let i in inputReview.img) {
          const img = await prisma.reviewImg.create(
              {data : {imgUrl : i, reviewId : success.id}});
          if (!img) {
            return {success : false};
          }
        }
      }
      return {success : true};
    } catch (err) {
      console.error(err);
    }
  }
  async updateReview(inputReview: Review, userInfo: Number,
                     reviewInfo: Number): Promise<any|false> {
    try {
      const review =
          await prisma.review.findUnique({where : {id : Number(reviewInfo)}});
      if (review?.userId === userInfo) {
        const updatedReview = await prisma.review.update({
          data : {review : inputReview.review, star : inputReview.star},
          where : {id : Number(reviewInfo)}
        })
        // 업데이트 이미지 삽입
        if (inputReview.img) {
          for (let i in inputReview.img) {
            const img = await prisma.reviewImg.create(
                {data : {imgUrl : i, reviewId : updatedReview.id}});
            if (!img) {
              return {success : false};
            }
          }
        }
      } else {
        return false;
      }
    } catch (err) {
    }
  }
  async deleteReview(deleteReviewId: number, userInfo: number): Promise<any> {
    try {
      const success = await prisma.review.delete(
          {where : {id : Number(deleteReviewId), userId : Number(userInfo)}});
      console.log(success);
      if (!success) {
        return {success : false};
      }
      return {success : true};
    } catch (err) {
      console.error(err);
    }
  }
}
module.exports = reviewService