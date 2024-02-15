import express, { Express, Request, Response } from "express";
import { OwnerService } from "../../service/owner.service";
import { Login } from "../../interface/user/login";
const ownerService = new OwnerService();

const output = {
  //해당 가게 메뉴 리스트 반환
  getMenuList: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).end();
      } else {
        const response = await ownerService.getMenuList(id);
        if (response.success) {
          return res
            .status(response.status)
            .json({ ...response })
            .end();
        } else {
          return res
            .status(response.status)
            .json({ ...response })
            .end();
        }
      }
    } catch (err) {
      return res.status(500).end();
    }
  },
};

const process = {
  ownerSignUp: async (req: Request, res: Response) => {
    //사업자로 회원 가입
    try {
      const response = await ownerService.ownerSignUp(req.body);

      if (response.success) {
        return res.status(201).end();
      }
      return res.status(response.status).json(response).end();
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  },

  ownerSignIn: async (req: Request, res: Response) => {
    //사업자로 로그인
    try {
      const response = await ownerService.ownerSignIn(req.body);

      if (response.success) {
        return res.status(201).json(response).end();
      }

      return res.status(response.status).end();
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  },

  //메뉴 입력
  postMenu: async (req: Request, res: Response) => {
    try {
      const response = await ownerService.insertMenu(req.body);
      if (response.success) {
        return res.status(response.status).json(response).end();
      }
      return res.status(response.status).json(response).end();
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  },

  deleteMenu: async (req: Request, res: Response) => {},

  updateMenu: async (req: Request, res: Response) => {},
};

module.exports = {
  output,
  process,
};
