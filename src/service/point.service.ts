import { Prisma, PrismaClient } from "@prisma/client";
import { randomPoint } from '../util/randomPoint';
const logger = require('../util/winston');
const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});

export class PointService {
    async getPoint( id : number ){
       
        try{
            let point = 0;
            let randNum = 0;
            await prisma.$transaction(async (tx) => {
                const userData = await tx.user.findUnique({
                    where : {
                        id : id
                    }
                });

                point = userData?.point==null ? 0 : JSON.parse(JSON.stringify(userData?.point)) ; //type check 
                console.log(point);
                randNum = JSON.parse(JSON.stringify(randomPoint())); //포인트 적립
                console.log(randNum);
                point+=randNum;

                await tx.user.update({
                    where : {
                        id : id
                    },
                    data : {
                        point : point
                    }
                });

                return { success: true, status:201 , point:point, randNum:randNum }
            });
            
            
            //console.log(res);
            return { success: true, status:201 , point:point, randNum:randNum }
        }catch(err){
            //console.error(err);
            logger.error(err);
            return {success:false, status:500}
        }
    }
}