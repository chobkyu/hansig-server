const app = require('../app')
const request = require('supertest')
const should = require('should');

/**회원 가입 시 */
describe('post /user is..', function () {
    let testData = {
        userId:'test2',
        userPw:'1234',
        userName:'test_name',
        userNickName:'giwon'
    }

    let body:any;
    before(() => {
        request(app)
            .post('/users')
            .send(testData)
            .expect(201)
            .end((err:any,res:any) => {
                //console.log(res.body);
                body = res.body;
            });
    });

    describe('success', () => {
        let body = {
            userId:'test1',
            userPw:'1234',
            userName:'test_name1',
            userNickName:'giwon1'
        }
        it('201으로 응답한다', (done) => {
            request(app)
                .post('/users')
                .send(body)
                .expect(201)
                .end(done)
        });  

    });
    describe('fail..',()=>{
        it('입력이 잘못되었을 경우 400으로 응답한다',(done)=>{
            let body = {
                userId:'test1',
                userPw:'1234',
                userName:'test_name1',
            }
            request(app)
                .post('/users')
                .send(body)
                .expect(400)
                .end(done)
        });

        it('닉네임이 중복일 경우 409로 응답한다',done => {
            let body ={
                userId:'test3',
                userPw:'1234',
                userName:'test_name',
                userNickName:'giwon1'
            };

            request(app)
                .post('/users')
                .send(body)
                .expect(409)
                .end(done)
        });
        
        it('아이디가 중복일 경우 409로 응답한다',done => {
            let body ={
                userId:'test',
                userPw:'1234',
                userName:'test_name',
                userNickName:'giwon'
            };

            request(app)
            .post('/users')
            .send(body)
            .expect(409)
            .end(done);
        });
    })
});


/**로그인 시 */
describe('post /user/login...',function(){
    describe('성공 시',() => {
        let info = {
            userId: 'test1',
            userPw: '1234'
        }
        let body:any;
        before(done=> {
            request(app)
                .post('/users/login')
                .send(info)
                .expect(200)
                .end((err:any,res:any) => {
                    body = res.body;
                    done();
                });
        });

        it('토큰을 반환한다.',()=>{
            body.should.have.property('access');
        });

        it('토큰은 문자열이여야 한다.',()=>{
            body.access.should.be.instanceOf(String)
        });

    });

    describe('실패 시',() => {
        it('입력이 잘못되었을 경우 400으로 응답한다',(done)=>{
            let body = {
                userId:'test1',
                userPw:1234,
            }
            request(app)
                .post('/users/login')
                .send(body)
                .expect(400)
                .end(done)
        });

        it('입력되지 못 한 값이 있을 경우 400으로 응답한다',(done)=>{
            let body = {
                userId:'test1',
            }
            request(app)
                .post('/users/login')
                .send(body)
                .expect(400)
                .end(done)
        });

        it('일치하는 유저가 없을 경우 404로 응답한다',(done) => {
            let body = {
                userId: 'noUser',
                userPw: 'nonono'
            }
            request(app)
                .post('/users/login')
                .send(body)
                .expect(404)
                .end(done)
        });
    });
});


/**유저 정보 읽을 시 */
describe('GET /users/userinfo ',function() {
    describe('success', async ()=> {
        let body:any;
        before(done=> {
            request(app)
                .get('/users/userinfo')
                .set("authorization","Bearer testtoken")
                .end((err:any,res:any) => {
                    console.log(res.body.header)
                    body = res.body.data;
                    console.log(body);
                    done();
                });
        });

        it('유저 아이디가 포함되어야 한다.', function(){
            console.log(body)
            body.should.have.property('userId');
        });

        it('유저 닉네임이 포함되어야 한다.',async () => {
            body.should.have.property('userNickName');
        });

        it('유저 이름이 포함되어야 한다.',async () => {
            body.should.have.property('userName');
        });

        it('유저 이미지가 포함되어야 한다.',async () => {
            body.should.have.property('userImgs');
        });

    });

    describe('fail...',async () => {
        it('해당 유저가 없을 때 404 리턴',async () => {
            request(app)
                .get('/users/userinfo/99999')
                .set("Authorizaiton","Bearer testtoken")
                .expect(404)
                .end(async (err:any, res:any) =>{
                    console.log(res.body);
                })
        });

        //어차피 string 값으로 path로 인식해서 안됨(테스트 코드에서)
        // it('number 형식의 id가 아닐 때 400리턴',async() => {
        //     request(app)
        //         .get('/users/userinfo/기원이')
        //         .expect(400)
        //         .end(async (err:any, res:any) => {
        //             console.log(res);
        //         });
        // })
    });
});

/**유저 정보 수정 시 */
describe('/patch users/info', function(){
    describe('success',async () => {
        let testData = {
            userId:'test',
            userName:'test_Name',
            userNickName:'giwonLee'
        }
        it('201으로 응답한다', (done) => {
            request(app)
                .patch('/users/info')
                .set("authorization","Bearer testtoken")
                .send(testData)
                .expect(201)
                .end(done)
        }); 
    });

    describe('fail...', async ()=>{
        it('입력값이 잘못 되었을 경우 400으로 응답',(done) => {
            let testData = {
                userNickName:54
            }
            request(app)
                .patch('/users/info')
                .set("authorization","Bearer testtoken")
                .send(testData)
                .expect(400)
                .end(done);
        });

        it('잘못된 입력이 들어왔을 경우 400으로 응답',(done) => {
            let testData = {
                date:'2012'
            }
            request(app)
                .patch('/users/info')
                .set("authorization","Bearer testtoken")
                .send(testData)
                .expect(400)
                .end(done);
        });

        it('로그인이 안되어 있을 시 401로 응답',(done) => {
            let testData = {
                userId:'test',
                userName:'test_Name',
                userNickName:'giwonLee'
            }
            request(app)
                .patch('/users/info')
                .set("authorization","Bearer testtokerrn")
                .send(testData)
                .expect(401)
                .end(done);
        });

        
    });
});


/**지역 조회 시 */
describe('get user/location',function () {
    describe('성공 시' ,async () => {
        let body:any;
        before(done => {
            request(app)
                .get('/users/location')
                .end((err:any,res:any) => {
                    //console.log(res.body);
                    body = res.body.data;
                    done();
                });
        });

        it('리스트 형식이여야 한다.', function(){
            body.should.be.instanceOf(Array);
        });

        it('id가 포함되어 있어야 한다.', function(){
            body[0].should.have.property('id');
        });

        it('location이 포함되어 있어야 한다.', function(){
            body[0].should.have.property('location');
        });

        it('전체 리스트의 길이는 12여야한다.', function(){
            let len = body.length;
            len.should.equal(12);
        });

        it('id는 number 타입이여야한다.', function(){
            body[0].id.should.be.instanceOf(Number);
        });

        it('location은 string 타입이여야 한다.', function(){
            body[0].location.should.be.instanceOf(String);
        });
    });

    describe('실패 시 ', () => {

    });
});

describe('/delete users/deleteTestUser',function(){
    describe('success...',async () => {
        it('204로 응답한다.', (done) => {
            request(app)
            .delete('/users/deleteTestUser')
            .expect(204)
            .end(done)
        });
    });
});
//refresh요청,expired된 accesstoken과 refreshtoken,로그인된 상태에서
describe.only('post user/refresh',function () {
    describe('성공 시',() => {
        let info = {
            userId: 'refreshToken',
            userPw: '1234'
        }
        let original=process.env.TEST_MODE;
        process.env.TEST_MODE='access';
        let accessToken:any;
        let refreshToken:any;
        let data:any;
        before(done=> {
            request(app)
                .post('/users/login')
                .send(info)
                .expect(200)
                .end((err:any,res:any) => {
                     accessToken= res.body.access;
                     refreshToken=res.body.refresh;
                    done();
                });
        });
        after(()=>
        {
            process.env.TEST_MODE=original;
        })
        it('success',done => {
            request(app)
                .get('/users/refresh')
                .set("authorization",`Bearer ${accessToken}`)
                .set("refresh",refreshToken)
                .expect(200)
                .end((err:any,res:any) => {
                    console.log(res.body);
                    data=res.body.data;
                    done();
                });
        });
        it('data는 refreshToken을 포함해야한다.', function(){
            data.should.have.property('refresh');
        });
        it('data는 accessToken을 포함해야한다.', function(){
            data.should.have.property('access');
        });
        it('refresh는 string이여야한다.', function(){
            data.refresh.should.be.instanceOf(String);
        });
        it('access는 string이여야한다.', function(){
            data.access.should.be.instanceOf(String);
        });
    });//accesstoken이 잘못된경우,access의 소유주와 refresh의 소유주가 다른경우
    //refresh가 만료된경우, before, it으로 분리하자
    describe('실패 시 ', () => {
        it('refreshToken이 만료되었을시',async () => {
            let info = {
                userId: 'refreshToken',
                userPw: '1234'
            }
            let original=process.env.TEST_MODE;
            process.env.TEST_MODE='refresh';
            let accessToken:any;
            let refreshToken:any;
            let data:any;
           let res=await request(app)
                .post('/users/login')
                .send(info)
                .expect(200);
            accessToken= res.body.access;
            refreshToken=res.body.refresh;
            console.log(res._body);
            data=await request(app)
            .get('/users/refresh')
            .set("authorization",`Bearer ${accessToken}`)
            .set("refresh",refreshToken)
            .expect(401)
            console.log(data.body);
            process.env.TEST_MODE=original;
        });
        it('accessToken이 미만료되었을시',async () => {
            let info = {
                userId: 'refreshToken',
                userPw: '1234'
            }
            let original=process.env.TEST_MODE;
            process.env.TEST_MODE=undefined;
            let res=await request(app)
            .post('/users/login')
            .send(info)
            .expect(200);
            let accessToken:any;
            let refreshToken:any;
            let data:any;
            accessToken= res.body.access;
            refreshToken=res.body.refresh;
            data=await request(app)
            .get('/users/refresh')
            .set("authorization",`Bearer ${accessToken}`)
            .set("refresh",refreshToken)
            .expect(400)
            console.log(data.body);
            process.env.TEST_MODE=original;
        });
    });
   });