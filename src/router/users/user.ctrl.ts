import { PrismaClient } from "@prisma/client";
import { UserService } from "../../service/user.service";
import express,{Express,Request,Response} from 'express';
const prisma = new PrismaClient();
const userService = new UserService();


const output = {
    /**유저 정보 조회 */
    getUser: async (req:Request,res:Response) => {
        try{
            
            const id = parseInt(req.body.userData.id);
            console.log(req.body);
            //number 타입 id가 아닐시
            if(Number.isNaN(id)) return res.json({id}).status(400).end();

            const response = await userService.getUser(id);

            if(!response.success) {
                console.log(response)
                return res.status(response.status).end();
            }

            const data = response.data;
            return res.json({data}).status(201);
        }catch(err){
            console.log(err);
            return res.status(500).end();
        }
    }
}

const process = {
    /**회원가입 */
    insertUser : async (req:Request,res:Response) => {
        try{
            //console.log(req.body)
            const response = await userService.insertUser(req.body);
            if(response.success){
                return res.status(201).json(response).end();
            }
            return res.status(response.status).end();
        }catch(err){
            console.log(err)
            return res.status(500).end();

        }
    },

    /**로그인 */
    login : async(req:Request,res:Response) => {
        try{
            console.log(req.body);
            const response = await userService.login(req.body);
            if(response.success) return res.json(response);
            else return res.status(response.status).end();

        }catch(err){
            console.log(err);
            return res.status(500).end();
        }
    },

    /**유저 정보 업데이트 */
    updateUserData : async(req:Request,res:Response) => {
        try{
            console.log(req.body)
            
            const response = await userService.updateUserInfo(req.body);

            if(response.success) return res.status(201).end();
            else return res.status(response.status).end();

            return res.status(400)
        }catch(err){
            console.log(err);
            return res.status(500).end();
        }
    },

    //테스트 계정 삭제용
    deleteTestUser :async (req:Request, res:Response) => {
        try{
            const response = await userService.deleteTestUser();

            if(response.success){
                return res.status(204).end();
            }else{
                return res.status(404).end();
            }
        }catch(err){
            console.log(err);
            return res.status(500).end();
        }
    }
}

module.exports ={
    output,process
}