import { Request, Response } from "express";
import { UserAuth } from "../../entities/UserAuth";
import { AppDataSource } from "../../../data_source";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(UserAuth);

export class AuthController {
  static async signupUser(req: Request, res: Response) {
    const secretKey = "your-secret-key";
    const { email, password } = req.body ;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Submit all required parameters",
      });
    }

    try {
      const userQuery = userRepository.createQueryBuilder("user");
      const isRegistered = await userQuery
        .where("user.email = :email", { email: email })
        .getOne();
      if (isRegistered) {
        return res
          .status(200)
          .json({ success: false, error: "You already have account" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserAuth();
      user.email = email;
      user.password = hashedPassword;
      await userRepository.save(user);
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        secretKey,
        { expiresIn: "1h" }
      );
      return res.status(201).json({ success: true, token, user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async loginUser(req: Request, res: Response) {
    const secretKey = "your-secret-key";
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Submit all required parameters",
      });
    }
    const userQuery = userRepository.createQueryBuilder("user");

    const user = await userQuery
      .where("user.email = :email", { email: email })
      .getOne();
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Account with ${email} doesn't exist`,
      });
    }
    console.log(password, user.password, ">>>>>>>>>>>>>>>");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log(isPasswordValid, ">>>>>>>>>>>>>>>");

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Wrong password" });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });

    return res.status(200).json({ success: true, token, userData: { user } });
  }

  static async getCurrentUser(req: Request, res: Response) {
    const currentUser = req.body.currentUser;

    return res.status(200).json({
      success: true,
      data: { id: currentUser.id, email: currentUser.email },
    });
  }
}
