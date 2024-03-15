import { PrismaClient  } from "@prisma/client";

const logger = require("../util/winston");
const prisma = new PrismaClient();
export class AdminService{
    /**
     * enro;; list 조회
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
}