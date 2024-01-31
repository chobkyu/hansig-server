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

             //데이터 체크
            const dataCheck = this.checkData(body);
            if(!dataCheck.success) return {success:false, statusCode:400};

            //사업자 체크
            const check = checkOwner(body.ownerNum);
            if(!check.success) return {statusCode:401,msg:'사업자 번호를 확인하세요',success:false};

           

            //아이디 중복 체크
            const checkId = await userService.checkId(body.userId);
            if(!checkId.success) return {success:false,statusCode:409};

            //닉네임 중복 체크
            if(body.userNickName!= null){
                const checkNickName = await userService.checkNickName(body.userNickName);
                if(!checkNickName.success) return {success:false, statusCode:409};
            }

            body.userPw = await userService.hashing(body.userPw);
            
            //transcation
            prisma.$transaction(async (tx) => {
                //유저 insert
                const insertUser = await tx.user.create({
                    data:{
                        userId:body.userId,
                        userPw:body.userPw,
                        userName:body.userName,
                        userNickName:body.userNickName,
                        userGradeId : 3
                    }
                });

                //insert 한뷔
                const insertHansicdang = await tx.hansics.create({
                    data:{
                        name:body.hansicdangName,
                        addr : body.hansicdangAddr,
                        userStar: '0',
                        google_star:'0',
                        location_id:body.location_id
                    }
                });

                //오너 테이블 입력
                const insertOwner = await tx.ownerData.create({
                    data:{
                        ownerNum : body.ownerNum,
                        isApproved : false,
                        hansicsId:insertHansicdang.id,
                        userId:insertUser.id
                    }
                });

                return {success:true, statusCode:201};
            });
           
            return {success:true, statusCode:201};
        }catch(err){
            console.error(err);
            return {success:false,statusCode:500};
        }
    }

    checkData = (user:SignUpData) => {
        if(user.userId == null || user.userName == null || user.userNickName == null || user.userPw ==null || user.ownerNum == null || user.hansicdangName == null || user.hansicdangAddr == null || user.location_id == null){
            return {success:false,status:400}
        }else if(typeof user.userId != "string" || typeof user.userName != "string" || typeof user.userNickName != "string" || typeof user.userPw != "string" || typeof user.ownerNum != "string" || typeof user.hansicdangName != 'string' || typeof user.hansicdangAddr != "string" || typeof user.location_id != 'number'){
            return {success:false,status:400}
        }else return {success:true};
    }
}

