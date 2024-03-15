import { PrismaClient  } from "@prisma/client";

const logger = require("../util/winston");

export class AdminService{
    async getEnrollList(){
        try{

        }catch(err){
            logger.error(err);
            return {success : false};
        }
    }
}