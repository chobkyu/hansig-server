const app = require('../app')
const request = require('supertest')

/**enroll list 불러오기 */
describe.only('GET /admin/enroll', function(){
    describe('성공 시' ,() =>{
        let body:any;

        before(done => {
            request(app)
                .get('/admin/enroll')
                .set("authorization","Bearer admintoken")
                .expect(200)
                .end((err:any,res:any) => {
                    console.log(res.body.data.user);
                    body = res.body.data;

                    done();
                });
        });

        it('성공 시 리스트가 반환되어야 한다', () =>{
            body.should.be.instanceOf(Array);
        });

        it('성공 시 각 요소에는 id가 포함되어야 한다',() => {
            body[0].should.have.property('id');
        });

        it('id는 number이여야 한다',async () => {
            body[0].id.should.be.instanceOf(Number);
        });

        it('성공 시 각 요소에는 name가 포함되어야 한다',() => {
            body[0].should.have.property('name');
        });

        it('name는 string이여야 한다',async () => {
            body[0].name.should.be.instanceOf(String);
        });

        it('성공 시 각 요소에는 addr가 포함되어야 한다',() => {
            body[0].should.have.property('addr');
        });

        it('addr는 string이여야 한다',async () => {
            body[0].addr.should.be.instanceOf(String);
        });

        it('성공 시 각 요소에는 location가 포함되어야 한다',() => {
            body[0].should.have.property('location');
        });

        it('성공 시 각 요소에는 user가 포함되어야 한다',() => {
            body[0].should.have.property('user');
        });
    });

    describe('실패 시 ',() => {
        it('관리자가 아닐 시 403으로 응답한다.',async () => {
            request(app)
                .get('/admin/enroll')
                .set("authorization","Bearer testtoken")
                .expect(403)
                .end((err:any,res:any) => {
                    
                });
        });

        it('로그인이 안되어 있을 시 401로 응답한다.', async () => {
            request(app)
                .get('/admin/enroll')
                .expect(403)
                .end((err:any,res:any) => {
                    
                });
        });
    })
})