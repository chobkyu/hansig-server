import { SignUpData } from "../interface/owner/signUp";
import request from "request";

module.exports = {
  checkOwner: (req: SignUpData): Promise<any> => {
    return new Promise((resolve, reject) => {
      //테스트용 오너
      if (req.ownerNum === "1234") resolve({ success: true });

      //외부 api 요청을 위한 데이터셋
      const body = {
        businesses: [
          {
            b_no: req.ownerNum,
            start_dt: req.startDate,
            p_nm: req.userName,
            p_nm2: "",
            b_nm: "",
            corp_no: "",
            b_sector: "",
            b_type: "",
            b_adr: "",
          },
        ],
      };
      const option = {
        uri: "http://api.odcloud.kr/api/nts-businessman/v1/validate?returnType=JSON",
        method: "POST",
        headers: {
          Authorization: `Infuser ${process.env.VALIDATE_OWNER_API_KEY}`,
        },
        body: body,
        json: true,
      };

      //외부 api 요청
      request.post(option, async (err: any, response: any, body: any) => {
        if (err) {
          console.error("에러 발생", err);
          reject(err);
        }
        if (body?.data[0]?.valid === "01") {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      });
    });
  },
};

/*
공공데이터 api 조회를 위한 데이터셋
{
  "businesses": [
    {
      "b_no":       (필수)사업자 등록 번호,
      "start_dt":   (필수)개업일자 yyyymmdd,
      "p_nm":       (필수)대표자성명,
      "p_nm2":      대표자성명2,
      "b_nm":       상호,
      "corp_no":    법인 등록 번호,
      "b_sector":   주업태명,
      "b_type":     주종목명,
      "b_adr":      사업장 주소
    }
  ]
}
필수는 아니어도 빈 문자열 "" 넣어야 함

ex)
{
  "businesses": [
    {
      "b_no": "0000000000",
      "start_dt": "20000101",
      "p_nm": "홍길동", 
      "p_nm2": "홍길동",
      "b_nm": "(주)테스트",
      "corp_no": "0000000000000",
      "b_sector": "",
      "b_type": "",
      "b_adr": ""
    }
  ]
}
 */
