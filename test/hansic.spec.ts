const app = require('../app')
const request = require('supertest')

describe('GET /hansic is ...', function () {
    this.timeout(10000)
    describe('success', async () => {
        it('return data', async () => {
            request(app)
                .get('/hansic')
                .end(async (err: any, res: any) => {

                    //console.log(res.body)
                    res.body.should.be.instanceOf(Array)
                    //done();


                })
        })
    })
});

/**한긱 뷔페 전체 조회 */
describe('GET /hansic/all ...', function () {
    describe('성공 시', async () => {
        let body: any;

        before(done => {
            request(app)
                .get('/hansic/all')
                .expect(200)
                .end((err: any, res: any) => {
                    body = res.body.data;
                    //console.log(body[0]);
                    done();
                });
        });


        it('리스트 형식의 데이터를 반환한다', function() {
            body.should.be.instanceOf(Array);
        });

        /**한뷔 id */
        it('리스트 각 요소에는 id가 포함되어야 한다.', async () => {
            body[0].should.have.property('id');
        });

        it('리스트 각 요소에는 name이 포함되어야 한다.', async () => {
            body[0].should.have.property('name');
        });

        it('리스트 각 요소에는 addr이 포함되어야 한다.', async () => {
            body[0].should.have.property('addr');
        });

        it('리스트 각 요소에는 userStar가 포함되어야 한다.', async () => {
            body[0].should.have.property('userStar');
        });

        it('리스트 각 요소에는 google_star가 포함되어야 한다.', async () => {
            body[0].should.have.property('google_star');
        });

        it('리스트 각 요소에는 location이 포함되어야 한다.', async () => {
            /**location name, not location id */
            body[0].should.have.property('location');
        });

        it('리스트 각 요소에는 location_id가 포함되어야 한다.', async () => {
            body[0].should.have.property('location_id');
        });

        it('리스트 각 요소에는 imgUrl이 포함되어야 한다.', async () => {
            body[0].should.have.property('imgUrl');
        });

        
    });

    describe('fail...', async () => {
        /**테스트 코드는 추가를 안하지만 해당 비즈니스 로직 작성 */
        it('리스트가 null 일 때 204를 리턴한다.', async () => {

        });
    })

});

/**한식 뷔페 지역 별 조회 */
describe('GET /hansic/loc/:id ...', function () {
    describe('성공 시', () => {
        let body: any;

        before(done => {
            request(app)
                .get('/hansic/loc/1')
                .expect(200)
                .end((err: any, res: any) => {
                    body = res.body.data;
                    //console.log(body);
                    done();
                });
        });


        it('성공 시 지역 별 한식 뷔페 리스트 형식 반환', async () => {
            body.should.be.instanceOf(Array);
        });
        
        /**한뷔 id */
        it('리스트 각 요소에는 id가 포함되어야 한다.', async () => {
            body[0].should.have.property('id');
        });

        it('리스트 각 요소에는 name이 포함되어야 한다.', async () => {
            body[0].should.have.property('name');
        });

        it('리스트 각 요소에는 addr이 포함되어야 한다.', async () => {
            body[0].should.have.property('addr');
        });

        it('리스트 각 요소에는 userStar가 포함되어야 한다.', async () => {
            body[0].should.have.property('userStar');
        });

        it('리스트 각 요소에는 google_star가 포함되어야 한다.', async () => {
            body[0].should.have.property('google_star');
        });

        it('리스트 각 요소에는 location이 포함되어야 한다.', async () => {
            /**location name, not location id */
            body[0].should.have.property('location');
        });

        it('리스트 각 요소에는 location_id가 포함되어야 한다.', async () => {
            body[0].should.have.property('location_id');
        });

        it('리스트 각 요소에는 imgUrl이 포함되어야 한다.', async () => {
            body[0].should.have.property('imgUrl');
        });

        it('리스트 요소의 location_id는 요청 id 값과 같아야 한다',async () => {
            body[0].location_id.should.be.equal(1);
        });

    });

    describe('실패 시 ', async () => {
        it('id 입력 시 타입이 number가 아니면 400 리턴', async () => {
            request(app)
                .get(encodeURIComponent('/hansic/loc/서울'))
                .expect(400)
                .end(async (err: any, res: any) => {
                    //(res.body);
                });
        });

        /**현재 지역 아이디는 1부터 12까지 입니다. 
         * 디비에 가지 않고 비즈니스 로직에서 거를 수 있으면 좋을거 같습니다.
        */
        it('없는 지역 id를 요청 시 404 리턴', async () => {
            request(app)
                .get('/hansic/loc/5000')
                .expect(404)
                .end(async (err: any, res: any) => {

                    console.log(res.body);
                });
        });
    });
});


/**즐겨찾는 한식 뷔페 조회 */
describe('GET /hansic/star/user ...', function () {


    describe('성공 시', () => {
        let body: any;

        before(done => {
            request(app)
                .get('/hansic/star/user')
                .set("authorization","Bearer testtoken")
                .expect(200)
                .end((err: any, res: any) => {
                    body = res.body;
                    console.log(body);
                    done();
                });
        });

        it('성공 시 userId가 포함되어야 한다',async () => {
            body.should.have.property('userId');
        });

        it('userID는 string이여야 한다',async () => {
            body.userId.should.be.instanceOf(String);
        });

        it('성공 시 userNickName가 포함되어야 한다',async () => {
            body.should.have.property('userNickName');
        });

        it('userNickName은 string이여야 한다',async () => {
            body.userNickName.should.be.instanceOf(String);
        });

        it('성공 시 favorites가 포함되어야 한다.',async () => {
            body.should.have.property('favorites');
        });

        it('favorite은 리스트 형식 반환', async () => {
            body.favorites.should.be.instanceOf(Array);
        });

        it('리스트 각 요소에는 hansics가 포함되어야 한다.', async () => {
            body.favorites[0].should.have.property('hansics');
        });

        it('hansics 리스트 각 요소에는 id가 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('id');
        });

        it('hansics 리스트 각 요소에는 name이 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('name');
        });

        it('hansics 리스트 각 요소에는 addr이 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('addr');
        });

        it('hansics 리스트 각 요소에는 userStar가 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('userStar');
        });

        it('hansics 리스트 각 요소에는 google_star가 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('google_star');
        });

        it('hansics 리스트 각 요소에는 lat가 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('lat');
        });

        it('hansics 리스트 각 요소에는 lng가 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('lng');
        });

        it('hansics 리스트 각 요소에는 location이 포함되어야 한다.', async () => {
            /**location name, not location id */
            body.favorites[0].hansics.should.have.property('location');
        });

        it('hansics 리스트 각 요소에는 location_id가 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('location_id');
        });

        it('hansics 리스트 각 요소에는 sicdangImgs가 포함되어야 한다.', async () => {
            body.favorites[0].hansics.should.have.property('sicdangImgs');
        });
       

    });

    describe('실패 시 ', async () => {
        it('로그인이 안되어 있을 시 401 리턴', async () => {
            request(app)
                .get(encodeURIComponent('/hansic/star'))
                .expect(401)
                .end(async (err: any, res: any) => {
                    console.log(res.body);

                    //console.log(res.body);

                });
        });
    });
});


describe('GET /hansic/:id ...', function () {
    describe('성공 시', async () => {
        let body : any;
        before(done => {
            request(app)
                .get('/hansic/1796')
                .set("authorization","Bearer testtoken")
                .expect(200)
                .end((err:any,res:any) => {
                    //console.log(res.body);
                    body = res.body.data;
                    //console.log(body);
                    done();
                });
        });

        it('해당 데이터는 id를 포함 하어야 한다.', async () => {
            body.should.have.property('id');
        });

        it('해당 데이터의 id는 요청 id와 값이 일치해야 한다.',async () => {
            body.id.should.equal(1796);
        });

        it('해당 데이터는 name을 포함 하어야 한다.', async () => {
            body.should.have.property('name');
        });

        it('해당 데이터는 addr를 포함 하어야 한다.', async () => {
            body.should.have.property('addr');
        });

        it('해당 데이터는 useStar를 포함 하어야 한다.', async () => {
            body.should.have.property('userStar');
        });

        it('해당 데이터는 google_star를 포함 하어야 한다.', async () => {
            body.should.have.property('google_star');
        });

        it('해당 데이터는 location_id를 포함 하어야 한다.', async () => {
            body.should.have.property('location_id');
        });

        it('해당 데이터는 location을 포함 하어야 한다.', async () => {
            body.should.have.property('location');
        });

        it('해당 데이터는 imgUrl을 포함 하어야 한다.', async () => {
            body.should.have.property('imgUrl');
        });
        it('해당 데이터는 favorite을 포함 하어야 한다.', async () => {
            body.should.have.property('favorite');
        });
        /**리뷰 내용 포함... 추후 작성 예정 */

        
    });

    describe('실패 시', async () => {
        it('해당 데이터를 찾을 수 없을 시 404 리턴', async () => {
            request(app)
                .get('/hansic/200000')
                .expect(404)
                .end(async (err: any, res: any) => {
                   // console.log(res.body);
                   // console.log(res.status);
                });
        });

        it('잘못된 id 입력 시 400 리턴', async () => {
            request(app)
                .get(encodeURIComponent('/hansic/기원이한뷔'))
                .expect(400)
                .end(async (err: any, res: any) => {
                });
        });
    });
});

//좌표검색 기능 테스트
describe('GET /hansic/place?lat=N&lng=E ...', function () {
    describe('성공 시', async () => {
        let body : any;
        before(done => {
            request(app)
                .get('/hansic/place?lat=37.4860146411306&lng=126.89329203683')
                .set("authorization","Bearer testtoken")
                .expect(200)
                .end((err:any,res:any) => {
                    body = res.body.data;
                    done();
                });
        });

        it('해당 데이터는 id를 포함 하어야 한다.', async () => {
            body.should.have.property('id');
        });

        it('해당 데이터의 lat는 요청 lat와 값이 일치해야 한다.',async () => {
            body.lat.should.equal(37.4860146411306);
        });

        it('해당 데이터의 lng는 요청 lng와 값이 일치해야 한다.',async () => {
            body.lng.should.equal(126.89329203683);
        });
        it('해당 데이터는 name을 포함 하어야 한다.', async () => {
            body.should.have.property('name');
        });

        it('해당 데이터는 addr를 포함 하어야 한다.', async () => {
            body.should.have.property('addr');
        });

        it('해당 데이터는 useStar를 포함 하어야 한다.', async () => {
            body.should.have.property('userStar');
        });

        it('해당 데이터는 google_star를 포함 하어야 한다.', async () => {
            body.should.have.property('google_star');
        });

        it('해당 데이터는 location_id를 포함 하어야 한다.', async () => {
            body.should.have.property('location_id');
        });

        it('해당 데이터는 location을 포함 하어야 한다.', async () => {
            body.should.have.property('location');
        });

        it('해당 데이터는 imgUrl을 포함 하어야 한다.', async () => {
            body.should.have.property('imgUrl');
        });
        it('해당 데이터는 favorite을 포함 하어야 한다.', async () => {
            body.should.have.property('favorite');
        });
        /**리뷰 내용 포함... 추후 작성 예정 */

        
    });

    describe('실패 시', async () => {
        it('해당 데이터를 찾을 수 없을 시 404 리턴', async () => {
            request(app)
                .get('/hansic/place?lat=37&lng=126')
                .expect(404)
                .end(async (err: any, res: any) => {
                });
        });

        it('잘못된 좌표 입력 시 400 리턴', async () => {
            request(app)
                .get(encodeURIComponent('/hansic/place?lat=-1&lng=-5'))
                .expect(400)
                .end(async (err: any, res: any) => {
                    //console.log(res.body);
                });
        });
    });
});

//한식 뷔페 즐겨 찾기
describe('post /hansic/star/:id', function (){
    describe('성공 시', () =>{
        it('성공 시 201을 리턴한다', (done) =>{
            request(app)
                .post('/hansic/star/1796')
                .set("authorization","Bearer testtoken")
                .expect(201)
                .end(done);
        });
    });

    describe('실패 시', () => {
        it('해당 데이터를 찾을 수 없을 때는 404 리턴', (done) => {
            request(app)
                .post('/hansic/star/0')
                .set("authorization","Bearer testtoken")
                .expect(404)
                .end(done);
        });

        it('사용자가 유효하지 않는 입력을 했을 시 400 리턴', (done) => {
            request(app)
                .post('/hansic/star/hiyo')
                .set("authorization","Bearer testtoken")
                .expect(400)
                .end(done);
        });

        it('로그인이 안되어 있을 시 401 리턴',(done) => {
            request(app)
                .post('/hansic/star/1796')
                .expect(401)
                .end(done);
        });
    });
});

//내가 아는 한식 뷔페 등록하기
describe('post /hansic/enroll', function (){
    describe('성공 시', () => {
        let body = {
            name: '기원이한뷔',
            addr: '서울특별시 강남구',
            location : 1,
            imgUrl : 'https://puda.s3.ap-northeast-2.amazonaws.com/client/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7+2024-02-07+152742.png'
        }
        it('성공 시 201을 리턴한다', (done) => {
            request(app)
                .post('/hansic/enroll')
                .set("authorization","Bearer testtoken")
                .send(body)
                .expect(201)
                .end(done);
        });
    });

    describe('실패 시',() => {
      
        it('로그인이 안되어 있을 시 401로 응답', (done) => {
            let body = {
                name: '기원이한뷔',
                addr: '서울특별시 강남구',
                location : 1,
                imgUrl : 'https://puda.s3.ap-northeast-2.amazonaws.com/client/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7+2024-02-07+152742.png'
            }

            request(app)
                .post('/hansic/enroll')
                .send(body)
                .expect(401)
                .end(done);
        });

        it('입력값이 잘못 되었을 경우 400으로 응답',(done) => {
            let body = {
                name: '기원이한뷔',
                addr: 1,
                location : 1,
                imgUrl : 'https://puda.s3.ap-northeast-2.amazonaws.com/client/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7+2024-02-07+152742.png'
            }

            request(app)
                .post('/hansic/enroll')
                .set("authorization","Bearer testtoken")
                .send(body)
                .expect(400)
                .end(done);
        });

        it('입력값이 누락 되었을 경우 400으로 응답', (done) => {
            let body = {
                name: '기원이한뷔',
                addr: '서울특별시 강남구',
                imgUrl : 'https://puda.s3.ap-northeast-2.amazonaws.com/client/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7+2024-02-07+152742.png'
            }

            request(app)
                .post('/hansic/enroll')
                .set("authorization","Bearer testtoken")
                .send(body)
                .expect(400)
                .end(done);
        });

        it('다른 입력 값이 들어왔을 경우 400로 응답', (done) => {
            let body = {
                name: '기원이한뷔',
                addr: '서울특별시 강남구',
                location_id : 1,
                imgUrl : 'https://puda.s3.ap-northeast-2.amazonaws.com/client/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7+2024-02-07+152742.png'
            }

            request(app)
                .post('/hansic/enroll')
                .set("authorization","Bearer testtoken")
                .send(body)
                .expect(400)
                .end(done);
        });


    });
});


