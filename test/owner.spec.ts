const app = require('../app')
const request = require('supertest')
const should = require('should');
//https://www.youtube.com/watch?v=lvjDDn9cpL4
/**사업자로 회원 가입 시 */
describe('post /owner',function () {
    describe('success',() => {
        let testData = {
            userId:'owner3',
            userPw:'1234',
            userName:'test_owner',
            userNickName:'ElonMusk1',
            ownerNum:'1234',
            hansicdangName: '기원한뷔',
            hansicdangAddr:'하남시 어딘가',
            location_id:1
        }

        it('201로 응답한다.',(done) => {
            request(app)
                .post('/owner')
                .send(testData)
                .expect(201)
                .end(done)
        });
    });

    describe('fail..',() => {
        it('사업자가 아닐 경우 401로 응답',(done) => {
            let testData = {
                userId:'owner2',
                userPw:'1234',
                userName:'test_owner',
                userNickName:'ElonMusk',
                ownerNum:12341234,
                hansicdangName: '기원한뷔',
                hansicdangAddr:'하남시 어딘가',
                location_id:1
            }
            request(app)
                .post('/owner')
                .send(testData)
                .expect(401)
                .end(done);
        });

        it('아이디가 중복일 경우 409로 응답',(done) => {
            let testData = {
                userId:'owner1',
                userPw:'1234',
                userName:'test_owner',
                userNickName:'ElonMusk',
                ownerNum:'1234',
                hansicdangName: '기원한뷔',
                hansicdangAddr:'하남시 어딘가',
                location_id:1
            }

            request(app)
                .post('/owner')
                .send(testData)
                .expect(409)
                .end(done);
        });

        it('입력값이 누락되었을 경우 400으로 응답',(done) => {
            let testData = {
                userId:'owner2',
                userPw:'1234',
                userName:'test_owner',
                userNickName:'ElonMusk',
                ownerNum:'1234'
            }

            request(app)
                .post('/owner')
                .send(testData)
                .expect(400)
                .end(done);
        });

        it('입력값이 잘못 되었을 경우 400으로 응답',(done) => {
            let testData = {
                userId:'owner2',
                userPw:'1234',
                userName:1234,
                userNickName:'ElonMusk',
                ownerNum:'1234',
                hansicdangName: '기원한뷔',
                hansicdangAddr:'하남시 어딘가',
                location_id:1
            }

            request(app)
                .post('/owner')
                .send(testData)
                .expect(400)
                .end(done);

        });
    });
});

/**사업자로 로그인 시 */
describe('post /owner/login ',function () {
    describe('success',() =>{
        let body = {
            userId:'owner1',
            userPw:'1234',
        }

        let response:any;

        before(done => {
            request(app)
                .post('/owner/login')
                .send(body)
                .expect(201)
                .end((err:any,res:any) => {
                    response = res.body;
                    console.log(response);
                    done();
                });
        });

        it('성공 시 201로 응답, 토큰 반환',() => {
            response.should.have.property('token');
        });

        it('토큰은 문자열이여야 한다.',() => {
            response.token.should.be.instanceOf(String);
        });
    });

    describe('fail',() => {
        it('입력이 잘못 되었을 시 400으로 응답한다.',(done) => {
            let body = {
                userId:'owner1',
                userPw:1234
            }

            request(app)
                .post('/owner/login')
                .send(body)
                .expect(400)
                .end(done);
        });

        it('입력이 누락 되었을 시 400으로 응답한다.',(done) => {
            let body = {
                userId:'owner1',
            }

            request(app)
                .post('/owner/login')
                .send(body)
                .expect(400)
                .end(done);
        });

        it('입력에 다른 값이 있을 시 400으로 응답한다.',(done) => {
            let body = {
                userId:'owner1',
                userPw:'1234',
                userNickName : 'hiyo'
            }

            request(app)
                .post('/owner/login')
                .send(body)
                .expect(400)
                .end(done);
        });

        it('사업자가 아닐 시 401로 응답한다.',(done) => {
            let body = {
                userId: 'test',
                userPw: '1234'
            }

            request(app)
                .post('/owner/login')
                .send(body)
                .expect(401)
                .end(done);
        });
    });
});


/**메뉴 입력 시 */
describe('post /owner/menu',function () {
    describe('성공 시 ',()=>{
        let menu = {
            name : '제육볶음',
            useFlag: 'true',
            userId : 58, //테스트 시 쓸 계정과 가게 생성 예정
            hansicsId : 101,
            price : 2000,
            imgUrl : 'test.png'
        };

        let body : any;

        it('성공 시 201로 응답한다.',done => {
            request(app)
                .post('/owner/menu')
                .send(menu)
                .expect(201)
                .end(done);
        });
    });

    describe('실패 시',() => {
        it('입력 값이 잘못 되었을 경우 400으로 응답한다.', (done) => {
            let menu = {
                name : 1234,
                useFlag: 'true',
                userId : 58, //테스트 시 쓸 계정과 가게 생성 예정
                hansicsId : 101,
                price : 2000,
                imgUrl : 'test.png'
            };

            request(app)
                .post('/owner/menu')
                .send(menu)
                .expect(400)
                .end(done);
        });

        it('입력 값이 누락 되었을 경우 400으로 응답한다.',(done) => {
            let menu = {
                useFlag: 'true',
                userId : 58, //테스트 시 쓸 계정과 가게 생성 예정
                hansicsId : 101,
                price : 2000,
                imgUrl : 'test.png'
            };

            request(app)
                .post('/owner/menu')
                .send(menu)
                .expect(400)
                .end(done);
        });

        it('다른 입력 값이 들어왔을 경우 400으로 응답한다.',(done) => {
            let menu = {
                name : 1234,
                useFlag: 'true',
                userId : 58, //테스트 시 쓸 계정과 가게 생성 예정
                hansicsId : 101,
                price : 2000,
                imgUrl : 'test.png',
                hansics : 5
            };

            request(app)
                .post('/owner/menu')
                .send(menu)
                .expect(400)
                .end(done);
        });
    });
});

/**메뉴 조회 시 (id는 식당 id) */
describe('get /owner/menu/:id', function() {
    describe('성공 시',()=>{
        let body:any;
        before(done => {
            request(app)
                .get('/owner/menu/1')
                .set("authorization","Bearer testtoken")
                .end((err:any,res:any) => {
                    body = res.body.data;
                    done();
                });
        });

        it('리스트가 리턴되어야 한다', function () {
            body.shold.be.instanceOf(Array);
        });

        it('리스트 각 요소에는 id가 포함되어야 한다', function () {
            body.should.have.property('id');
        });

        it('해당 식당 id는 요청 id와 일치해야 한다.', function (){
            body.id.shoud.be.equal(1);
        });

        it('리스트 각 요소에는 name이 포함되어야 한다', function () {
            body.should.have.property('name');
        });

        it('리스트 각 요소에는 price이 포함되어야 한다', function () {
            body.should.have.property('price');
        });

        it('리스트 각 요소에는 imgUrl이 포함되어야 한다', function () {
            body.should.have.property('imgUrl');
        });

        it('리스트가 null이면 204 리턴',(done) => {
            request(app)
                .get('/owner/menu/2')
                .set("authorization","Bearer testtoken")
                .expect(204)
                .end((err:any,res:any)=>{
                    done();
                });
        });
        
    });

    describe('실패 시',() => {
        it('없는 id면 404 리턴',(done) => {
            request(app)
                .get('/owner/menu/0')
                .set("authorization","Bearer testtoken")
                .expect(404)
                .end((err:any,res:any)=>{
                    done();
                });
        });

        /** 이건 나중에 메뉴 조회를 다른 사용자들도 할 수 있으면 수정 예정 */
        it('로그인이 안되어 있으면 401 리턴',(done) => {
            request(app)
                .get('/owner/menu/0')
                .expect(401)
                .end((err:any,res:any)=>{
                    done();
                });
        });
     
    });
});


/**메뉴 삭제 시 */
describe('delete /owner/menu/:id', function () {
    describe('성공 시',() => {
        it('204를 응답한다.',(done) => {
            request(app)
                .delete('/owner/menu/1') //테스트용 메뉴 생성 예정
                .set("authorization","Bearer testtoken") //테스트용 토큰 생성 예정
                .expect(204)
                .end(done)
        });

    });

    describe('실패 시',() => {
        it('id가 숫자가 아닐 경우 400으로 응답',(done) => {
            request(app)
                .delete('/owner/menu/제육')
                .set("authorization","Bearer testtoken")
                .expect(400)
                .end(done)
        });

        it('없는 메뉴일 경우 404로 응답',(done) => {
            request(app)
                .delete('/owner/menu/0')
                .set("authorization","Bearer testtoken")
                .expect(404)
                .end(done)
        });

        it('권한이 없을 경우 401로 응답',(done) => {
            request(app)
                .delete('/owner/menu/1')
                .set("authorization","Bearer testtoken") //토큰 생성 예정
                .expect(400)
                .end(done)
        });

        it('로그인이 안되어 있을 시 401로 응답',(done) => {
            request(app)
                .delete('/owner/menu/1')
                .expect(400)
                .end(done)
        });
    });
});

/**수정 시 */
describe('patch /owner/menu/:id',function () {
    describe('성공 시',() => {

    });

    describe('실패 시',() => {

    });
});
