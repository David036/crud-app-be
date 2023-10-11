import express from "express";
import { AuthController } from "../../controllers/auth";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", AuthController.signupUser);
router.post("/login", AuthController.loginUser);
router.get("/getCurrentUser",authMiddleware, AuthController.getCurrentUser);

export default router;
