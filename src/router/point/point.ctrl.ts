import { PointService } from "../../service/point.service"
import { Request,Response} from 'express';
const pointService = new PointService();
const logger = require('../../util/winston');

const output = {

}

const process = {
    getPoint : async (req:Request,res:Response) => {
        try{
            const userId = req.body.userData.id;
            const response = await pointService.getPoint(userId);

            if(response.status != 201){
                return res.status(response.status).end();
            }
            const pointObj = {
                point : response.point, 
                randNum : response.randNum 
            }
            return res.status(response.status).send(pointObj).end();
        }catch(err){
            console.log(err);
            logger.error(err);
            return res.status(500).end();
        }
    }
}

module.exports = {
    output,
    process
}