import { PrismaClient } from "@prisma/client";
import { SignUpData } from "../interface/owner/signUp";
import { UserService } from "./user.service";

const {checkOwner} = require('../util/checkOwner');
const jwt = require('../util/jwt-util');

const prisma = new PrismaClient();
const userService = new UserService();

export class OwnerService {
    ownerSignUp = async (body:SignUpData) => {
        try{
            const check = checkOwner(body.onwerNum);

            //사업자 체크
            if(!check.success) return {statusCode:401,msg:'사업자 번호를 확인하세요'};

            //데이터 체크
            const dataCheck = this.checkData(body);
            if(!dataCheck.success) return {success:false, status:400};

            //아이디 중복 체크
            const checkId = await userService.checkId(body.userId);
            if(!checkId.success) return {success:false,status:409};

            //닉네임 중복 체크
            if(body.userNickName!= null){
                const checkNickName = await userService.checkNickName(body.userNickName);
                if(!checkNickName.success) return {success:false, status:409};
            }

            body.userPw = await userService.hashing(body.userPw);
            
            //transcation
            prisma.$transaction(async (tx) => {
                const insertUser = await tx.user.create({
                    data:{
                        userId:body.userId,
                        userPw:body.userPw,
                        userName:body.userName,
                        userNickName:body.userNickName,
                        userGradeId : 3
                    }
                });

                const insertHansicdang = await tx.hansics.create({
                    data:{
                        name:body.hansicdangName,
                        addr : body.hansicdangAddr,
                        userStar: '0',
                        google_star:'0',
                        location_id:body.location_id
                    }
                });

                const insertOwner = await tx.ownerData.create({
                    data:{
                        ownerNum : body.onwerNum,
                        isApproved : false,
                        hansicsId:insertHansicdang.id,
                        userId:insertUser.id
                    }
                });

                return insertOwner;
            });
           

        }catch(err){
            console.error(err);
            return {success:false};
        }
    }

    checkData = (user:SignUpData) => {
        if(user.userId == null || user.userName == null || user.userNickName == null || user.userPw ==null || user.onwerNum == null){
            return {success:false,status:400}
        }else if(typeof user.userId != "string" || typeof user.userName != "string" || typeof user.userNickName != "string" || typeof user.userPw != "string" || typeof user.onwerNum != "string" ){
            return {success:false,status:400}
        }else return {success:true};
    }
}

