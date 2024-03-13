import { PrismaClient, review, reviewComment } from "@prisma/client";
import { Logger } from "winston";
import { Review } from "../interface/review/review";
import { ReviewComment } from "../interface/review/reviewComment";
import { ReviewUpdate } from "../interface/review/reviewUpdate";
import { success } from "../interface/success";
import { user } from "../interface/user/user";

import { UserService } from "./user.service";

const logger = new Logger();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
class reviewService {
  // 해당 id의 한식당이 있는지 check
  async checkRestaurant(restaurantId: number): Promise<boolean> {
    try {
      const restaurant = await prisma.hansics.findUnique(
        { where: { id: Number(restaurantId) } });
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
  //해당 리뷰가 있는지 확인
  async checkReview(reviewId: number): Promise<boolean> {
    try {
      const review = await prisma.review.findUnique({ where: { id: Number(reviewId) } });
      if (review) {
        return true;
      }
      else { return false; }
    }
    catch (err: any) {
      logger.error(err);
      return false;
    }
  }
  //해당 리뷰댓글이 있는지 확인
  async checkReviewComment(reviewCommentId: number): Promise<boolean> {
    try {
      const review = await prisma.reviewComment.findUnique({ where: { id: Number(reviewCommentId) } });
      if (review) {
        return true;
      }
      else { return false; }
    }
    catch (err: any) {
      logger.error(err);
      return false;
    }
  }
  // 데이터 타입 체크
  checkReviewDTO(body: any) {
    try {
      console.log(body, Object.keys(body).length);
      if (Object.keys(body).length === 3) {
        if (body.review && body.userData && body.star &&
          typeof body.review === 'string' && typeof body.star === 'number') {
          return true;
        }
        return false;
      } else if (Object.keys(body).length === 4) {
        if (body.review && body.userData && body.star && body.img &&
          typeof body.review === 'string' && typeof body.star === 'number') {
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
  async getReview(reviewId: number): Promise<any> {
    try {
      prisma.$on
      const review = await prisma.review.findUnique({
        select: {
          id: true,
          review: true,
          star: true,
          user: { select: { id: true, userNickName: true } },
          reviewComments: { where: { useFlag: true } },
          reviewImgs: { select: { imgUrl: true } },
          useFlag: true
        },
        where: { id: reviewId }
      })
      // 검색결과가 있으면
      if (review) {
        return { success: true, review: review };
      }
      else {
        return { success: false };
      }
    } catch (err) {
      logger.error(err);
      return { success: false };
    }
  }
  // 한식당의 id로 해당식당의 리뷰들과 각 리뷰들의
  // 유저정보,(user.id,user.userNickName)
  // 리뷰코멘트들(reviewComments),imgUrl들(reviewImgs.imgUrl)을 리턴받는다
  async getReviewList(restaurantId: number): Promise<any[] | any> {
    try {
      const review = await prisma.review.findMany({
        select: {
          id: true,
          review: true,
          star: true,
          user: { select: { id: true, userNickName: true } },
          reviewComments: { where: { useFlag: true } },
          reviewImgs: { select: { imgUrl: true } },
          useFlag: true
        },
        where: { hansicsId: restaurantId }
      })
      // 검색결과가 있으면
      if (review) {
        return { success: true, reviewList: review };
      }
      else {
        return { success: false };
      }
    } catch (err) {
      logger.error(err);
      return { success: false };
    }
  }

  async getUserReviewList(id: number) {
    try {
      //console.log(id);
      const reviewList = await prisma.review.findMany({
        where: {
          useFlag: true,
          userId: id,
        },
        select: {
          id: true,
          review: true,
          star: true,
          hansics: { select: { id: true, name: true } },
          reviewImgs: { select: { imgUrl: true } }
        },


      });

      if (reviewList.length == 0) {
        return { success: true, status: 204, reviewList };
      }

      return { success: true, status: 200, reviewList };

    } catch (err) {
      logger.error(err);
      return { success: false, status: 500 };
    }
  }
  // 리뷰작성
  /*interface Review {
    review : string,
    star : number,
    img? : Array<string>
}
   */
  async writeReview(inputReview: Review, userInfo: number,
    restaurantInfo: number): Promise<any> {
    try {
      let success;
      if (await this.checkRestaurant(Number(restaurantInfo))) {
        if (this.checkReviewDTO(inputReview)) {
          // img가 있는지 확인
          if (inputReview.img) {
            success = await prisma.$transaction(async (tx) => {
              const create = await tx.review.create({
                data: {
                  review: inputReview.review,
                  star: Number(inputReview.star),
                  hansicsId: Number(restaurantInfo),
                  userId: Number(userInfo),
                  useFlag: true,
                }
              });
              const imgData: any = inputReview.img?.map(imgUrl => ({
                imgUrl,
                reviewId: create.id,
              }));
              if (imgData) {
                const image = await tx.reviewImg.createMany({ data: imgData });
              }
            });
          } else {
            success = await prisma.review.create({
              data: {
                review: inputReview.review,
                star: Number(inputReview.star),
                hansicsId: Number(restaurantInfo),
                userId: Number(userInfo),
                useFlag: true
              }
            });
          }
        }
        else {
          return { success: false, status: 400 };
        }

      }
      else {
        return { success: false, status: 404 };
      }
      if (!success) {
        return { success: false };
      }
      return { success: true };
    } catch (err) {
      logger.error(err);
      return { success: false };
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
      let updatedReview: any, insertImg: any, deleteImg: any;
      updatedReview = undefined;
      // review가 있는지 체크
      const review = await prisma.review.findUnique(
        { where: { id: reviewInfo, useFlag: true } });
      // 원저작자인지 확인
      const user = await prisma.user.findUnique(
        { select: { id: true, userNickName: true }, where: { id: userInfo } });
      if (review?.userId === userInfo) {
        if (inputReview.insertImg) // 삽입할 이미지가 있는지 확인
        {                          // img array를 분리대입.
          insertImg = inputReview.insertImg?.map(
            imgUrl => ({ imgUrl, reviewId: reviewInfo }));
        }                            // 삭제할 img확인
        if (inputReview.deleteImg) { // 삭제할 img id를 분리
          deleteImg = inputReview.deleteImg?.map(id => ({ id }));
        }
        // 트랜잭션
        await prisma.$transaction(async (tx) => {
          updatedReview = await tx.review.update({
            data: { review: inputReview.review, star: inputReview.star },
            where: { id: reviewInfo }
          });
          if (insertImg) {
            await tx.reviewImg.createMany({ data: insertImg });
          }
          if (deleteImg) {
            await tx.reviewImg.deleteMany({ where: { id: deleteImg.id } });
          }
        });
        if (updatedReview) {
          // 수정후 이미지
          const newReviewImage = await prisma.reviewImg.findMany(
            { select: { imgUrl: true }, where: { reviewId: reviewInfo } });
          // 리뷰 코멘트
          const ReviewComments = await prisma.reviewComment.findMany(
            { where: { reviewId: reviewInfo } });
          return {
            success: true,
            id: updatedReview.id,
            review: updatedReview.review,
            star: updatedReview.star,
            useFlag: updatedReview.useFlag,
            userId: updatedReview.userId,
            hansicsId: updatedReview.hansicsId,
            reviewComments: ReviewComments,
            reviewImgs: newReviewImage,
            user: user
          };
        } else // updatedReview가 실패한경우.
        {
          return { success: false };
        }
      } else { // 작성자가 아닌경우
        return { success: false, status: 403 };
      }
    } catch (err) {
      logger.error(err);
      return { success: false, status: 500 };
    }
  }
  // soft delete
  async deleteReview(deleteReplyId: number, userInfo: number): Promise<any> {
    try {
      let success;
      // 테스트인 경우, 복원허용
      if (deleteReplyId < 0 && process.env.NODE_ENV === 'test') {
        success = await prisma.review.update({
          data: { useFlag: true },
          where: { id: -deleteReplyId, userId: userInfo }
        });
      } else {
        // 작성자 확인
        let res = await prisma.review.findUnique(
          { where: { id: deleteReplyId, useFlag: true } });
        if (!res) {
          return { success: false, status: 404 };
        }
        if (userInfo !== res?.userId) {
          return { success: false, status: 403 };
        }
        success = await prisma.review.update({
          data: { useFlag: false },
          where: { id: deleteReplyId, userId: userInfo }
        });
      }
      if (!success) {
        return { success: false };
      }
      return { success: true };
    } catch (err: any) {
      logger.error(err);
      if (err.status) {
        return { success: false, status: err.status }
      }
      return { success: false };
    }
  }
  async writeReviewComment(inputReview: string, userInfo: number,
    reviewInfo: number): Promise<any> {
    try {
      const success = await prisma.reviewComment.create({
        data: {
          comment: inputReview,
          reviewId: reviewInfo,
          userId: userInfo,
        }
      });

      if (!success) {
        return { success: false };
      }
      return { success: true };
    } catch (err) {
      logger.error(err);
      return { success: false };
    }
  }
  async updateReviewComment(input: string, userInfo: number,
    reviewCommentInfo: number): Promise<any> {
    try {
      let updatedComment: any;
      // review가 있는지 체크
      const reviewComment =
        await prisma.reviewComment.findUnique({ where: { id: reviewCommentInfo, useFlag: true } });
      // 원저작자인지 확인
      const user = await prisma.user.findUnique(
        { select: { id: true, userNickName: true }, where: { id: userInfo } });
      if (reviewComment?.userId === userInfo) {
        updatedComment = await prisma.reviewComment.update({
          data: { comment: input },
          where: { id: reviewCommentInfo, userId: userInfo }
        });
        if (updatedComment) {
          return await this.getReview(Number(updatedComment.reviewId));
        } else {
          return { success: false };
        }
      } else { // 작성자가 아닌경우
        return { success: false, status: 403 };
      }
    } catch (err) {
      logger.error(err);
      return { success: false, status: 500 };
    }
  }
  // soft delete
  async deleteReviewComment(deleteReplyId: number,
    userInfo: number): Promise<any> {
    try {
      let success;
      // 작성자 확인
      let commentUser = await prisma.reviewComment.findUnique({ where: { id: deleteReplyId, useFlag: true } });
      if (commentUser?.userId === userInfo) {
        //테스트모드인 경우 복원허용
        if (deleteReplyId < 0 && process.env.NODE_ENV === 'test') {
          success = await prisma.reviewComment.update({
            data: { useFlag: true },
            where: { id: -deleteReplyId, userId: userInfo }
          });
          if (!success) {
            return { success: false };
          }
          return { success: true };
        }
        success = await prisma.reviewComment.update(
          { data: { useFlag: false }, where: { id: deleteReplyId, userId: userInfo } });
        //삭제실패시
        if (!success) {
          return { success: false };
        }
        return { success: true };
      }
      else {
        return { success: false, status: 403 };
      }
    } catch (err: any) {
      logger.error(err);
      if (err.status) {
        return { success: false, status: err.status }
      }
      return { success: false };
    }
  }
}
module.exports = reviewService