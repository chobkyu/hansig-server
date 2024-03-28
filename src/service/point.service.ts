import { Prisma, PrismaClient } from "@prisma/client";
import { randomPoint } from '../util/randomPoint';
const logger = require('../util/winston');
const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});

export class PointService {
    async getPoint( id : number ){
        let point:number  = 0;
        let randNum:number = 0;
        try{
            prisma.$transaction(async (tx) => {
                const userData = await tx.user.findUnique({
                    where : {
                        id : id
                    }
                });


                point = userData?.point==null ? 0 : userData?.point ; //type check 

                randNum = randomPoint(); //포인트 적립
                point+=randNum;

                await tx.user.update({
                    where : {
                        id : id
                    },
                    data : {
                        point : point
                    }
                });
            });

            return { success: true, status:201 , point, randNum }
           
        }catch(err){
            //console.error(err);
            logger.error(err);
            return {success:false, status:500}
        }
    }
}