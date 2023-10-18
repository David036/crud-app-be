import express from "express";
import { UserController } from "../../controllers/user";
import { authMiddleware } from "../../middleware/authMiddleware";
import { paginationMiddleware } from "../../middleware/paginationMiddleware";

const router = express.Router();

router.post("/create-user",authMiddleware, UserController.createUser);
router.get("/get-users", authMiddleware, paginationMiddleware, UserController.getUsers);
router.delete("/remove-user/:id", UserController.removeUser);
router.put("/update-user/:id", UserController.updateUser);
router.get("/search-users", authMiddleware, paginationMiddleware, UserController.searchUsers);

export default router;
