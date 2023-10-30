import { UserAuth } from "../../entities/UserAuth";
import { AppDataSource } from "../../../data_source";
import * as jwt from "jsonwebtoken";
import { RefreshToken } from "../../entities/RefreshToken";

const tokenRepository = AppDataSource.getRepository(RefreshToken);
const userRepository = AppDataSource.getRepository(UserAuth);
const secretKey = "your-secret-key";
const refreshSecretKey = "your-secret-key-a";

export class TokenController {
  static async generateToken(user: UserAuth) {
    const payload = { userId: user.id, email: user.email };
    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: "10s",
    });

    const refreshToken = jwt.sign(payload, refreshSecretKey, {
      expiresIn: "24h",
    });

    const isTokenExist = await tokenRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (isTokenExist) {
      isTokenExist.token = refreshToken;
      await tokenRepository.save(isTokenExist);
    } else {
      const newToken = new RefreshToken();
      newToken.user = user;

      await tokenRepository.save({
        user: user,
        token: refreshToken,
      });
    }

    return { accessToken, refreshToken };
  }

  static async refresh(req: any, res: any) {
    const oldRefreshToken = req.cookies["refreshToken"];

    const isTokenExist = await tokenRepository.findOne({
      where: {
        token: oldRefreshToken,
      },
      relations: {
        user: true,
      },
    });

    if (!isTokenExist) res.status(401);

    try {
      const isValidToken: any = jwt.verify(oldRefreshToken, refreshSecretKey);

      const user = await userRepository.findOne({
        where: { id: isValidToken.userId },
      });

      const { accessToken, refreshToken } = await TokenController.generateToken(
        user as UserAuth
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      res.send({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      res.status(401);
    }
  }
}
