import { Prisma, PrismaClient } from "@prisma/client";

const logger = require('../util/winston');
const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});

export class PointService {
    async getPoint( id : number ){
        try{
            prisma.$transaction(async (tx) => {
                const userData = await tx.user.findUnique({
                    where : {
                        id : id
                    }
                });


                let point:number  = userData?.point==null ? 0 : userData?.point ; //type check 
                
                point++; //포인트 적립

                await tx.user.update({
                    where : {
                        id : id
                    },
                    data : {
                        point : point
                    }
                });
            });

            return { success: true, status:201 }
           
        }catch(err){
            //console.error(err);
            logger.error(err);
            return {success:false, status:500}
        }
    }
}