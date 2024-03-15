import { AdminService } from "../../service/admin.service"
import express, { Express, Request, Response } from 'express';

const adminService = new AdminService();
const logger = require('../../util/winston');

const output = {
    getEnrollList: async (req:Request, res:Response) => {
        try{
            const response = await adminService.getEnrollList(req.body.userData.id);

            return res.status(response.status).json({data:response.response});
        }catch(err){
            logger.error(err);
            console.log(err);
            return res.status(500).end();
        }
    }
}

const process = {

}

module.exports = {
    output,
    process
}