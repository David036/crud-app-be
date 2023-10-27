import express from "express";
import { ProductController } from "../../controllers/product";
import { authMiddleware } from "../../middleware/authMiddleware";
import { paginationMiddleware } from "../../middleware/paginationMiddleware";

const router = express.Router();

router.post("/create-product", authMiddleware, ProductController.createProduct);
router.get(
  "/get-products",
  authMiddleware,
  paginationMiddleware,
  ProductController.getProducts
);
router.delete("/remove-product/:id", ProductController.removeProduct);
router.put("/update-product/:id", ProductController.updateProduct);
router.get(
  "/search-products",
  authMiddleware,
  paginationMiddleware,
  ProductController.searchProducts
);

export default router;
