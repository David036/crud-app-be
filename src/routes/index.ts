import { Router } from "express";

import UserRouter from "./users/index";
import AuthRouter from "./auth/index";
import ProductRouter from "./products/index";

const router = Router();

router.use("/users", UserRouter);
router.use("/auth", AuthRouter);
router.use("/products", ProductRouter);

export default router;
