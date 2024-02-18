import { PrismaClient, Prisma } from "@prisma/client";
import { SignUpData } from "../interface/owner/signUp";
import { UserService } from "./user.service";
import { Login } from "../interface/user/login";
import bcrypt from "bcrypt";
import { MenuData, checkMenuDataCount } from "../interface/owner/menu";

const { checkOwner } = require("../util/checkOwner");
const jwt = require("../util/jwt-util");

const prisma = new PrismaClient();
const userService = new UserService();

export class OwnerService {
  /**사업자 회원 가입
   * @summary 사업자 번호 유효성 검증 및 데이터 체크 후 회원가입
   */
  ownerSignUp = async (body: SignUpData) => {
    try {
      //데이터 체크
      const dataCheck = this.checkData(body);
      if (!dataCheck.success) return { success: false, status: 400 };

      //사업자 체크
      const check = await checkOwner(body);
      if (!check.success)
        return {
          status: 401,
          msg: "정보를 제대로 입력했는지 확인하세요",
          success: false,
        };

      //아이디 중복 체크
      const checkId = await userService.checkId(body.userId);
      if (!checkId.success) return { success: false, status: 409 };

      //닉네임 중복 체크
      if (body.userNickName != null) {
        const checkNickName = await userService.checkNickName(
          body.userNickName
        );
        if (!checkNickName.success) return { success: false, status: 409 };
      }

      body.userPw = await userService.hashing(body.userPw);

      //transcation
      prisma.$transaction(async (tx) => {
        //유저 insert
        const insertUser = await tx.user.create({
          data: {
            userId: body.userId,
            userPw: body.userPw,
            userName: body.userName,
            userNickName: body.userNickName,
            userGradeId: 3,
          },
        });

        //insert 한뷔
        const insertHansicdang = await tx.hansics.create({
          data: {
            name: body.hansicdangName,
            addr: body.hansicdangAddr,
            userStar: "0",
            google_star: "0",
            location_id: body.location_id,
          },
        });

        //오너 테이블 입력
        const insertOwner = await tx.ownerData.create({
          data: {
            ownerNum: body.ownerNum,
            isApproved: false,
            hansicsId: insertHansicdang.id,
            userId: insertUser.id,
          },
        });
      });

      return { success: true, status: 201 };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  //회원가입 시 필요한 데이터 체크
  checkData = (user: SignUpData) => {
    if (
      user.userId == null ||
      user.userName == null ||
      user.userNickName == null ||
      user.userPw == null ||
      user.ownerNum == null ||
      user.hansicdangName == null ||
      user.hansicdangAddr == null ||
      user.location_id == null ||
      user.startDate == null
    ) {
      return { success: false, status: 400 };
    } else if (
      typeof user.userId != "string" ||
      typeof user.userName != "string" ||
      typeof user.userNickName != "string" ||
      typeof user.userPw != "string" ||
      typeof user.ownerNum != "string" ||
      typeof user.hansicdangName != "string" ||
      typeof user.hansicdangAddr != "string" ||
      typeof user.location_id != "number" ||
      typeof user.startDate != "string" ||
      user.startDate.length != 8 ||
      isNaN(+user.startDate)
    ) {
      return { success: false, status: 400 };
    } else return { success: true };
  };

  /**사업자 로그인
   * @summary 데이터 체크 후 로그인. JWT 토큰 반환
   */
  ownerSignIn = async (body: Login) => {
    try {
      const user = body;
      console.log(user);
      //데이터 체크
      const checkData = userService.checkLoginData(user);
      console.log(checkData);
      if (!checkData.success) return { success: false, status: 400 };

      //사용자 존재 확인
      const getUser = await this.getUser(user);
      if (!getUser.success) return { success: false, status: getUser.status };

      //사업자 여부 확인
      if (getUser.user != undefined) {
        const checkOwner = await this.getOwner(getUser.user.id);

        if (checkOwner.success)
          return { success: true, status: 201, token: getUser.token };
        else return { success: false, status: checkOwner.status };
      } else return { success: false, status: 500 };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  //로그인 시 사용자 조회
  getUser = async (body: Login) => {
    try {
      const res = await prisma.user.findFirst({
        where: {
          userId: body.userId,
        },
      });

      if (res?.userId == null || res.userPw == null) {
        return { success: false, status: 404 };
      }

      const check = await bcrypt.compare(body.userPw, res?.userPw);

      if (check) {
        //로그인 성공
        const accessToken = jwt.sign(res);
        return { success: true, status: 201, token: accessToken, user: res };
      } else
        return {
          //로그인 실패
          success: false,
          status: 500,
        };
    } catch (err) {
      console.log(err);
      return { success: false, status: 500 };
    }
  };

  //오너 확인
  getOwner = async (id: number) => {
    try {
      const res = await prisma.ownerData.findFirst({
        where: {
          userId: id,
        },
      });

      if (res) return { success: true, status: 201 };
      else return { success: false, status: 401 };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  /**메뉴 입력
   * @summary 데이터 체크 후 DB에 insert
   */
  insertMenu = async (menuData: MenuData) => {
    try {
      //입력값 유효성 확인
      const dataCheck = await this.insertMenuDataCheck(menuData);
      if (!dataCheck.success)
        return {
          success: false,
          status: 400,
          msg: "데이터를 제대로 입력했는지 확인하세요",
        };

      //트랜잭션
      prisma.$transaction(async (tx) => {
        //menu insert
        const insertMenuInfo = await tx.menu.create({
          data: {
            name: menuData.name,
            useFlag: true,
            userId: menuData.userData.id,
            hansicsId: menuData.hansicsId,
            price: menuData.price,
          },
        });

        //menuImg insert
        const insertMenuImgInfo = await tx.menuImg.create({
          data: {
            imgUrl: menuData.menuImg,
            useFlag: true,
            menuId: insertMenuInfo.id,
          },
        });
      });

      return { success: true, status: 201 };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  //메뉴 입력 데이터 체크
  insertMenuDataCheck = async (menuData: MenuData) => {
    try {
      //다른 데이터 입력 방지
      const count = Object.keys(menuData).length;
      if (!checkMenuDataCount(count)) return { success: false };

      //데이터 누락 및 타입 체크
      if (
        typeof menuData?.name !== "string" ||
        typeof menuData?.userData?.id !== "number" ||
        typeof menuData?.hansicsId !== "number" ||
        typeof menuData?.price !== "number" ||
        typeof menuData?.menuImg !== "string"
      )
        return { success: false };
      else return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  /**해당 가게 메뉴 리스트 읽기
   * @summary 데이터 체크 후 menuList 반환
   */
  getMenuList = async (id: number) => {
    try {
      //입력값 타입 확인
      if (typeof id !== "number") return { success: false, status: 400 };
      //DB에 hansicsId 존재 확인
      const idCheck = await this.validateHansicsId(id);
      if (!idCheck.success) return { success: false, status: 400 };

      //string을 sql로 변환
      const query = Prisma.sql`
        SELECT
          menu.id, menu.name, menu."userId", menu."hansicsId", menu.price, "menuImg"."imgUrl"
        FROM (SELECT * FROM menu WHERE "hansicsId" = ${id} AND "useFlag" = true) as menu
        INNER JOIN "menuImg"
        ON menu.id = "menuImg"."menuId";
      `;
      //결과
      const menuList = await prisma.$queryRaw(query);

      return { success: true, status: 200, menuList };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  //hansicsId 존재 확인 여부
  validateHansicsId = async (id: number) => {
    try {
      const hansicsId = await prisma.hansics.findUnique({
        where: {
          id: id,
        },
      });
      if (!hansicsId) return { success: false };
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  /**메뉴 수정
   * @summary 데이터 체크 후 DB update
   */
  updateMenu = async (id: number, updateMenuData: MenuData) => {
    try {
      //입력값 유효성 확인
      if (typeof id !== "number") return { success: false, status: 400 };
      const dataCheck = await this.insertMenuDataCheck(updateMenuData);
      if (!dataCheck.success)
        return {
          success: false,
          status: 400,
          msg: "데이터를 제대로 입력했는지 확인하세요",
        };
      //불러오기 및 DB에 존재 확인
      const data = await this.getMenu(id);
      if (!data.success) return { success: false, status: 400 };
      if (!Array.isArray(data.menu)) return { success: false, status: 400 };
      const menuId = data.menu[0].id;
      const menuImgId = data.menu[0].menuImgId;

      //트랜잭션
      prisma.$transaction(async (tx) => {
        //menu DB 수정
        const updateMenu = await tx.menu.update({
          where: {
            id: menuId,
          },
          data: {
            name: updateMenuData.name,
            hansicsId: updateMenuData.hansicsId,
            price: updateMenuData.price,
          },
        });
        //menuImg DB 수정
        const updateMenuImg = await tx.menuImg.update({
          where: {
            id: menuImgId,
          },
          data: {
            imgUrl: updateMenuData.menuImg,
          },
        });
      });

      return { success: true, status: 201 };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  /**메뉴 삭제
   * @summary 데이터 체크 후 DB에 useFlag false로 변경
   */
  deleteMenu = async (id: number) => {
    try {
      //입력값 유효성 확인
      if (typeof id !== "number") return { success: false, status: 400 };
      //불러오기 및 DB에 존재 확인
      const data = await this.getMenu(id);
      if (!data.success) return { success: false, status: 400 };
      if (!Array.isArray(data.menu)) return { success: false, status: 400 };
      const menuId = data.menu[0].id;
      const menuImgId = data.menu[0].menuImgId;

      //트랜잭션
      prisma.$transaction(async (tx) => {
        //menu DB에 useFlag 수정
        const updateMenuUseFlag = await tx.menu.update({
          where: {
            id: menuId,
          },
          data: {
            useFlag: false,
          },
        });
        //menuImg DB에 useFlag 수정
        const updateMenuImgUseFlag = await tx.menuImg.update({
          where: {
            id: menuImgId,
          },
          data: {
            useFlag: false,
          },
        });
      });

      return { success: true, status: 204 };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };

  /**메뉴 하나 데이터 읽기
   * @summary menu 테이블, menuImg 테이블 조인하여 필요 정보만 반환
   */
  getMenu = async (menuId: number) => {
    try {
      //string을 sql로 변환
      const query = Prisma.sql`
      SELECT
        menu.id, menu.name, menu."userId", menu."hansicsId", menu.price, "menuImg".id as "menuImgId", "menuImg"."imgUrl"
      FROM (SELECT * FROM menu WHERE "id" = ${menuId}) as menu
      INNER JOIN "menuImg"
      ON menu.id = "menuImg"."menuId";
      `;
      //결과
      const menu = await prisma.$queryRaw(query);
      if (Array.isArray(menu) && menu.length === 0)
        return { success: false, status: 400 };
      return { success: true, status: 200, menu };
    } catch (err) {
      console.error(err);
      return { success: false, status: 500 };
    }
  };
}
