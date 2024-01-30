module.exports = {
    checkOwner : (ownerNum : number) => {
        //테스트용 오너
        if(ownerNum == 1234){
            return {success:true};
        }

        //공공데이터 api 연동하여 사업자 조회 예정
        return {success:false};
    }
}