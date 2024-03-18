import { PrismaClient  } from "@prisma/client";
import { InsertHansicDto } from "../interface/admin/insertHansic";
import { HansicService } from "./hansic.service";

const hansicServiceClass = require('./hansic.service');
const hansicService = new hansicServiceClass();

const logger = require("../util/winston");
const prisma = new PrismaClient(/*{log: ['query', 'info', 'warn', 'error']}*/);
export class AdminService{
     /**
     * 관리자 id 판단
     * @param id number
     * @returns {success:boolean}
     */
     async checkAdmin(id:number){
        try{
            const check = await prisma.user.findUnique({
                where : {
                    id : id
                }
            });

            if(check?.userGradeId == 2){ 
                return { success:true }; //admin
            }else{
                return { success:false };
            }
        }catch(err){
            return { success:false };
        }
    }


    /**enroll list 조회
     * @param id number 유저 id
     * @returns enrollHansic[]
     */
    async getEnrollList(id:number){
        try{
            const checkAdmin = await this.checkAdmin(id);

            if(!checkAdmin.success){
                return {success:false,status:403};
            }

            const response = await prisma.enrollHansic.findMany({
                where : { isApproved : false },
                select : {
                    id:true,
                    name:true,
                    addr:true,
                    location : true,
                    user : {
                        select : {
                            id :true, userId:true, userName:true, userNickName:true
                        }
                    },
                }
            });
            
            return { success : true, response, status : 200 };

        }catch(err){
            logger.error(err);
            return {success : false, status : 500 };
        }
    }

   
   /**
    * 
    * @param id number enroll id
    * @param userId number userId
    * @returns enroll data
    */ 
    async getEnrollOne(id:number,userId:number){
        try{
            const checkAdmin = await this.checkAdmin(userId);

            if(!checkAdmin.success){
                return {success:false,status:403};
            }

            const response = await prisma.enrollHansic.findUnique({
                where : { isApproved : false, id:id },
                select : {
                    id:true,
                    name:true,
                    addr:true,
                    location : true,
                    user : {
                        select : {
                            id :true, userId:true, userName:true, userNickName:true
                        }
                    },
                }
            });

            return { success : true, response, status : 200 };

        }catch(err){
            logger.error(err);
            return {success:false,status:500}
        }
    }

    /**
     * 등록하기 허용
     * @param data : InsertHansicDto
     * @returns {success:boolean,status:number}
     */
    async enrollHansic(data:InsertHansicDto) {
        try{
            const checkAdmin = await this.checkAdmin(data.userData.id);

            //관리자 체크
            if(!checkAdmin.success){
                return {success:false,status:403};
            }

            const checkData = this.checkData(data);

            //데이터 체크
            if(!checkData.success){
                return {success:false, status:400};
            }
            const selectData = await prisma.enrollHansic.findUnique({
                where : { id:data.id, name:data.name, addr:data.addr, location_id:data.location, isApproved:false }
            });

            //존재 유무 확인
            if(!selectData){
                return {success:false,status:404};
            };
            
            const getLatlng =  await hansicService.tryGeo();


            prisma.$transaction(async (tx) => {
                const insertHansic = await tx.hansics.create({
                    data: {
                        name:data.name,
                        addr : data.name,
                        google_star : '리뷰 없음',
                        location_id:data.location,
                        lat: getLatlng.lat,
                        lng: getLatlng.lng
                    }
                });

                const updateEnroll = await tx.enrollHansic.update({
                    where : { id : data.id },
                    data : { isApproved : true},
                });

                //나중에 이미지 url 추가 및 등록 유저 point 제도 도입 예정
            });

            return { success: true, status:201};
        }catch(err){
            logger.error(err);
            console.log(err);
            return { success : false , status : 500 }
        }
    }

    checkData(body:InsertHansicDto){
        console.log(body);
        if(
          body.id == null ||
          body.addr == null ||
          /*body.imgUrl == null ||*/ //나중에 추가 예정
          body.location == null ||
          body.userId == null ||
          body.name == null 
        ){
            return { success: false, status : 400};
        }else if(
            typeof body.id != "number" ||
            typeof body.addr != "string" ||
            /*typeof body.imgUrl != "string" ||*/
            typeof body.location != "number" ||
            typeof body.userId != "number" ||
            typeof body.name != "string" 
        ){
            return { success:false, status : 400};
        }else{
            return {success:true};
        }
    }
}