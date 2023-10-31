import { Router } from "express";
import { AuthController } from "../../controllers/auth";
import { authMiddleware } from "../../middleware/authMiddleware";
import { TokenController } from "../../controllers/token";

const router = Router();

router.post("/signup", AuthController.signupUser);
router.post("/login", AuthController.loginUser);
router.get("/getCurrentUser", authMiddleware, AuthController.getCurrentUser);
router.get("/refresh", TokenController.refresh);
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
