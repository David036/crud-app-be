import { Router } from "express";

import UserRouter from "./users/index";
import AuthRouter from "./auth/index";

const router = Router();

router.use("/users", UserRouter);
router.use("/auth", AuthRouter);

export default router;
