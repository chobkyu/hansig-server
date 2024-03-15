import { PrismaClient  } from "@prisma/client";

const logger = require("../util/winston");
const prisma = new PrismaClient();
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

            if(check){
                return { success:true };
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
}