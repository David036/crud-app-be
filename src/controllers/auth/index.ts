import { Request, Response } from "express";
import { UserAuth } from "../../entities/UserAuth";
import { AppDataSource } from "../../../data_source";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RefreshToken } from "../../entities/RefreshToken";

const userRepository = AppDataSource.getRepository(UserAuth);
const tokenRepository = AppDataSource.getRepository(RefreshToken);
const secretKey = "your-secret-key";
const refreshSecretKey = "your-secret-key-a";

export class AuthController {
  static async signupUser(req: Request, res: Response) {
    const { email, password, phoneNumber } = req.body;

    if (!email || !password || !phoneNumber) {
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
          .status(400)
          .json({ success: false, error: "You already have an account" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserAuth();
      user.email = email;
      user.password = hashedPassword;
      user.phoneNumber = phoneNumber;
      user.isAdmin = false;
      await userRepository.save(user);

      const accesstoken = jwt.sign(
        { userId: user.id, email: user.email },
        secretKey,
        {
          expiresIn: "1h",
        }
      );

      return res.status(201).json({ success: true, accesstoken, user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Submit all required parameters",
      });
    }

    const userQuery = userRepository.createQueryBuilder("user");
    const user = await userQuery
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Account with ${email} doesn't exist`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Wrong password" });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign({ userId: user.id }, refreshSecretKey, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ success: true, accessToken, userData: { user } });
  }

  static async getCurrentUser(req: Request, res: Response) {
    const currentUser = req.body.currentUser;

    return res.status(200).json({
      success: true,
      data: { id: currentUser.id, email: currentUser.email },
    });
  }

  static async logout(req: Request, res: Response) {
    const currentUser = req.body.currentUser;

    try {
      const userQuery = tokenRepository.createQueryBuilder("user");
      const userToRemove = await userQuery
        .where("user.id = :id", { id: currentUser.id })
        .getOne();
      if (userToRemove) {
        await tokenRepository.remove(userToRemove);
        res.clearCookie("refreshToken");
      }

      return res
        .status(200)
        .json({ message: "Logout successful", success: true });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
