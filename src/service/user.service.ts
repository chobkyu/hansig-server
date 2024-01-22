import { Login } from "../interface/login";
import { success } from "../interface/success";
import { UpdateInfoDto } from "../interface/updataInfo";
import { user } from "../interface/user";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
const jwt = require('../util/jwt-util');

const prisma = new PrismaClient();

class UserService {
    /**회원 가입 */
    async insertUser(body:user){
        const user:user = body;
        console.log(body)
        
        try{
            //데이터 체크
            const checkData = this.checkData(user);
            if(!checkData.success) return {success:false,status:400};

            //아이디 중복 체크
            const checkId = await this.checkId(user.userId);
            if(!checkId.success) return {success:false,status:409};

            //닉네임 중복 체크
            if(user.userNickName!= null){
                const checkNickName = await this.checkNickName(user.userNickName);
                if(!checkNickName.success) return {success:false, status:409};
            }
           

            //비밀번호 암호화
            user.userPw = await this.hashing(user.userPw);

            await prisma.user.create({
                data:{
                    userId:user.userId,
                    userPw:user.userPw,
                    userName:user.userName,
                    userNickName:user.userNickName
                }
            });
            return {success:true,status:201};
        }catch(err){
            console.error(err);
            return {success:false}
        }
    }

    /**비밀 번호 암호화 */
    async hashing(userPw:string){    
        const saltRound = 10; //암호화 연산에 사용되는 salt의 cost, 높을수록 암호화 연산이 증가하는 대신 속도가 느려짐
        const salt = await bcrypt.genSalt(saltRound);

        const hashedPassword = await bcrypt.hash(userPw,salt); //비밀번호 해쉬화

        return hashedPassword; //해쉬화한 비밀번호를 데이터베이스에 저장
    }

    /**입력 값 체크 */
    checkData(user:user){
        if(user.userId == null || user.userName == null || user.userNickName == null || user.userPw ==null){
            return {success:false,status:400}
        }else if(typeof user.userId != "string" || typeof user.userName != "string" || typeof user.userNickName != "string" || typeof user.userPw != "string" ){
            return {success:false,status:400}
        }else return {success:true};
    }


    /**닉네임 중복체크 */
    async checkNickName(userName:string) : Promise<success>{
        try{
            const res = await prisma.user.findFirst({
                where:{
                    userNickName:userName
                },
            });

            if(res){
                return {success:false};
            }else{
                return {success:true};
            }
        }catch(err){
            console.log(err);
            return {success:false};
        }
    }

    /**아이디 중복 체크 */
    async checkId(userId:string) : Promise<success>{
        try{
            const res = await prisma.user.findFirst({
                where:{
                    userId:userId
                }
            });

            if(res) return {success:false};
            else return {success:true};

        }catch(err){
            console.log(err);
            return {success:false};
        }
    }

    /**유저 로그인 */
    async login(body:Login) {
        const user = body;

        //데이터 체크
        const checkData = this.checkLoginData(user);
        if(!checkData.success) return {success:false,status:400};

        const res = await prisma.user.findFirst({
            where:{
                userId:user.userId
            }
        });
        if(res?.userId==null || res.userPw==null){
            return {success:false,status:404}
        }
        const check = await bcrypt.compare(user.userPw,res?.userPw);

        if(check) { //로그인 성공
            const accessToken = jwt.sign(res);
            return {success:true,status:201,token:accessToken};
        }else return { //로그인 실패
            success:false, status:400
        }; 
        
    }

    /**로그인 데이터 체크 */
    checkLoginData(user:Login){
        if(user.userId == null || user.userPw ==null){
            return {success:false,status:400}
        }else if(typeof user.userId != "string" || typeof user.userPw != "string" ){
            return {success:false,status:400}
        }else return {success:true};
    }


    /**유저 데이터 조회 */    
    async getUser(userId:number) {
        try{
            const res = await prisma.user.findFirst({
                select:{
                    id:true,
                    userName:true,
                    userNickName:true,
                    userId:true,
                    userImgs:{
                        select:{
                            imgUrl:true,
                        },
                        where:{
                            userId:userId,
                            useFlag:true,
                        }
                    },
                },
                where:{
                    id:userId
                }
            });


            if(res?.userId==null) return {success:false,status:404,msg:userId};

            return {success:true,data:res};

        }catch(err){
            console.log(err);
            return {success:false};
        }
    }


    /**유저 데이터 수정 */
    async updateUserInfo(userInfoDto :UpdateInfoDto) {
        try{
            const updateUserId = userInfoDto.userData.id;

            const user : user = {
                userId : userInfoDto.userId,
                userName : userInfoDto.userName,
                userNickName : userInfoDto.userNickName,
                userPw :'mockpw'  //refactoring...
            }

            const check = this.checkData(user);
            if(!check.success) return {success:false,status:400};
            

            const updateUser = await prisma.user.updateMany({
                where : {
                    id: updateUserId
                },
                data : {
                    userId : userInfoDto.userId,
                    userNickName : userInfoDto.userNickName,
                    userName : userInfoDto.userName
                }
            });

            return {success:true};

        }catch(err){
            console.error(err);
            return {success:false};
        }
    }

    async deleteTestUser() {
        try{
            console.log('??')
            const res = await prisma.user.deleteMany({
                where: {
                    userId : {
                        in: ['test1','test2']
                    }
                }
            });

            return {success: true};
        }catch(err){
            console.log(err);
            return {success:false}
        }
    }
}


module.exports = UserService