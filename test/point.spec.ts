const app = require('../app')
const request = require('supertest')

//포인트 적립 이벤트
describe.only('patch /point', function(){
    describe('성공 시',() => {
        it('201로 응답한다.', (done) => {
            request(app)
                .patch('/point')
                .set("authorization","Bearer testtoken")
                .expect(201)
                .end(done);
        });
    });

    describe('실패 시',() => {
        it('로그인이 안되어 있을 시 401로 응답',(done) => {
            request(app)
                .patch('/point')
                .expect(401)
                .end(done);
        });
    })
})