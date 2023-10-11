import { UserAuth } from "./../entities/UserAuth";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../../data_source";

const userRepository = AppDataSource.getRepository(UserAuth);

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string;
  const secretKey = "your-secret-key";
  console.log("0>>>>>>>>>>>>>>>>>>>>");

  console.log(req.headers, "1>>>>>>>>>>>>>>>>>>>>");
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token as string;
  } else {
    return res.status(400).json({ error: "Missing or invalid token" });
  }

  try {
    console.log("1>>>>>>>>>>>>>>>>>>>>");
    const isValidToken: any = jwt.verify(token, secretKey);
    console.log("2>>>>>>>>>>>>>>>>>>>>");

    if (isValidToken) {
      const id = isValidToken.userId;
      const userQuery = userRepository.createQueryBuilder("user");

      const currentUser = await userQuery
        .where("user.id = :id", { id: id })
        .getOne();

      req.body.currentUser = currentUser;
      return next();
    } else {
      return res.status(400);
    }
  } catch (decodeError: any) {
    return res.status(400).json({ error: decodeError.message });
  }
};
