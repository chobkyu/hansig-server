const app = require('../app')
const request = require('supertest')
const should = require('should');

/**사업자로 회원 가입 시 */
describe('post /owner',function () {
    describe('success',() => {
        let testData = {
            userId:'owner1',
            userPw:'1234',
            userName:'test_owner',
            userNickName:'ElonMusk',
            ownerNum:1234
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
                ownerNum:12341234
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
                ownerNum:1234
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
                userName:'test_owner',
                userNickName:'ElonMusk',
                ownerNum:'fffff'
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
                userId: 'test1',
                userPw: '1234'
            }

            request(app)
                .post('/owner/login')
                .send(body)
                .expect(401)
                .end(done);
        })
    });
})