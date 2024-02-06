import express,{Express,Request,Response} from 'express';
import { OwnerService } from '../../service/owner.service';
import { Login } from '../../interface/user/login';
const ownerService = new OwnerService();

const output = {
    getMenuList :async (req:Request,res:Response) => {
        
    }
}

const process = {
    ownerSignUp :async (req:Request,res:Response) => {
        //사업자로 회원 가입
        try{
            const response = await ownerService.ownerSignUp(req.body);

            if(response.success) {
                return res.status(201).end();
            }

            return res.status(response.status).end();
        }catch(err){
            console.error(err);
            return res.status(500).end();
        }
    },

    ownerSignIn : async (req:Request,res:Response) => {
        //사업자로 로그인
        try{
            const response = await ownerService.ownerSignIn(req.body);

            if(response.success){
                return res.status(201).json(response).end();
            }

            return res.status(response.status).end();
        }catch(err){
            console.error(err);
            return res.status(500).end();
        }
    },
    ownerMenu :async (req:Request, res:Response) => {
        
    },

    deleteMenu :async (req:Request,res:Response) => {
        
    },

    updateMenu :async (req:Request, res:Response) => {
        
    }
}

module.exports = {
    output, process
}