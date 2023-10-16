import { Request, Response } from "express";
import { AppDataSource } from "../../../data_source";
import { User } from "../../entities/User";

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  static async createUser(
    req: Request,
    res: Response<User | unknown>
  ): Promise<void> {
    try {
      var id = req.body.currentUser.id;

      const user = new User();
      user.name = req.body.name;
      user.surname = req.body.surname;
      user.age = req.body.age;
      user.createdById = id;
      await userRepository.save(user);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      var id = req.body.currentUser.id;
      const allUsers = await userRepository.find( {where: {createdById: id} });
      return res.status(200).json({ success: true, data: allUsers });
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  }

  static async removeUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userQuery = userRepository.createQueryBuilder("user");
      const userToRemove = await userQuery
        .where("user.id = :id", { id: id })
        .getOne();

      if (userToRemove) {
        await userRepository.remove(userToRemove);
      } else {
        res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(userToRemove);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, surname, age } = req.body;

      const userToEdit = await userRepository.findOneBy({
        id,
      });

      if (userToEdit) {
        userToEdit.name = name;
        userToEdit.surname = surname;
        userToEdit.age = age;
        await userRepository.save(userToEdit);
        return res.status(200).json({ success: true, data: userToEdit });
      } else {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  static async searchUsers(req: Request, res: Response) {
    try {
      const searchValue = req.query?.searchValue;

      const allUsers = await userRepository.find();
      if (searchValue) {
        const searchedUsers = allUsers.filter((item) => {
          return Object.values(item)
            .map((value) => value.toString().toLowerCase())
            .some((stringValue) =>
              stringValue.includes(String(searchValue).toLowerCase())
            );
        });

        return res.status(200).json(searchedUsers);
      } else {
        return res.status(200).json(allUsers);
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }
}
