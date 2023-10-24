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

      const userInputValidation = validateUserInput({ name, surname, age });

      if (userInputValidation.isValid) {
        const user = new User();
        Object.assign(user, {
          name,
          surname,
          age,
          createdById: id,
          createdDate: new Date(),
        });

        await userRepository.save(user);
        res.status(201).json({ data: user, success: true });
      } else {
        res.status(400).json({ error: userInputValidation.errorMessage });
      }
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const { id } = req.body.currentUser;
      const { startIndex, limit } = req.pagination;

      const [allUsers, allUsersCount] = await Promise.all([
        userRepository.find({
          where: { createdById: id },
          order: { createdDate: "DESC" },
          skip: startIndex,
          take: limit,
        }),
        userRepository.count({
          where: { createdById: id },
        }),
      ]);

      res
        .status(200)
        .json({ success: true, data: allUsers, count: allUsersCount });
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
        res.status(200).json({ data: userToRemove, success: true });
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

      const userInputValidation = validateUserInput({ name, surname, age });

      if (userInputValidation.isValid) {
        const userToEdit = await userRepository.findOneBy({
          id,
        });

        if (userToEdit) {
          Object.assign(userToEdit, {
            name,
            surname,
            age,
            lastModifiedDate: new Date(),
          });

          await userRepository.save(userToEdit);
          res.status(200).json({ success: true, data: userToEdit });
        } else {
          res.status(404).json({ success: false, error: "User not found" });
        }
      } else {
        res.status(404).json({ success: false, error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  static async searchUsers(req: Request, res: Response) {
    try {
      const searchValue = req.query?.searchValue as string;
      const { id } = req.body.currentUser;
      const { startIndex, limit } = req.pagination;
      let query = userRepository
        .createQueryBuilder("user")
        .where("user.createdById = :id", { id })
        .orderBy("user.createdDate", "DESC");

      const allUsers = await query.getMany();

      const filteredUsers = allUsers.filter((user) => {
        if (!searchValue) return true;

        const agePattern = new RegExp(searchValue, "i");
        return (
          user.name.includes(searchValue) ||
          user.surname.includes(searchValue) ||
          agePattern.test(user.age.toString())
        );
      });

      const allUsersCount = filteredUsers.length;
      const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + limit
      );

      res.status(200).json({ data: paginatedUsers, count: allUsersCount });
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }
}

function validateUserInput(reqBody: any): {
  isValid: boolean;
  errorMessage?: string;
} {
  const { name, surname, age } = reqBody;

  if (!name || !surname || age == null) {
    return { isValid: false, errorMessage: "Missing required field" };
  }

  if (typeof age !== "number" || age < 1) {
    return {
      isValid: false,
      errorMessage: "Age must be a number greater than or equal to 1",
    };
  }

  return { isValid: true };
}
