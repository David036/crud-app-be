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
      const { id } = req.body.currentUser;
      const { name, surname, age } = req.body;

      const user = new User();
      user.name = name;
      user.surname = surname;
      user.age = age;
      user.createdById = id;

      await userRepository.save(user);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const { id } = req.body.currentUser;
      const { startIndex, limit } = req.pagination;

      const allUsers = await userRepository.find({
        where: { createdById: id },
        skip: 0,
        take: limit,
      });

      res.status(200).json({ success: true, data: allUsers });
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
        res.status(200).json(userToRemove);
      } else {
        res.status(404).json({ error: "User not found" });
      }
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
        res.status(200).json({ success: true, data: userToEdit });
      } else {
        res.status(404).json({ success: false, error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  static async searchUsers(req: Request, res: Response) {
    try {
      const searchValue = req.query?.searchValue;
      const { id } = req.body.currentUser;
      const { startIndex, limit } = req.pagination;
      let query = userRepository
        .createQueryBuilder("user")
        .where("user.createdById = :id", { id });

      if (searchValue) {
        query = query.andWhere(
          "(user.name LIKE :searchValue OR user.age = :age OR user.surname LIKE :searchValue)",
          {
            searchValue: `%${searchValue}%`,
            age: isNaN(Number(searchValue)) ? -1 : Number(searchValue),
          }
        );
  
        query = query.skip(0).take(limit);
  
        const searchedUsers = await query.getMany();
  
        res.status(200).json(searchedUsers);
      } else {
        query = query.skip(0).take(limit);
        const searchedUsers = await query.getMany();

        res.status(200).json(searchedUsers);
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }
}
