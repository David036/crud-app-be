import { Request, Response } from "express";
import { AppDataSource } from "../../../data_source";
import { Product } from "../../entities/Product";

const productRepository = AppDataSource.getRepository(Product);

export class ProductController {
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, price } = req.body;

      const product = new Product();
      if (title && description && price) {
        product.title = title;
        product.description = description;
        product.price = price;
      } else {
        res
          .status(400)
          .json({ success: false, error: "Missing required field" });
      }
      await productRepository.save(product);
      res.status(201).json({ data: product, success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: `${error}` });
    }
  }

  static async getProducts(req: Request, res: Response) {
    try {
      const { startIndex, limit } = req.pagination;

      const [allProducts, allProductsCount] = await Promise.all([
        productRepository.find({
          skip: startIndex,
          take: limit,
        }),
        productRepository.count(),
      ]);

      res
        .status(200)
        .json({ success: true, data: allProducts, count: allProductsCount });
    } catch (error) {
      res.status(400).json({ success: false, error: `${error}` });
    }
  }

  static async removeProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const productQuery = productRepository.createQueryBuilder("product");
      const productToRemove = await productQuery
        .where("product.id = :id", { id: id })
        .getOne();

      if (productToRemove) {
        await productRepository.remove(productToRemove);
        res.status(200).json({ data: productToRemove, success: true });
      } else {
        res.status(404).json({ success: false, error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: `${error}` });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, price } = req.body;

      if (title && description && price) {
        const productToEdit = await productRepository.findOneBy({
          id,
        });
        if (productToEdit) {
          Object.assign(productToEdit, {
            title,
            description,
            price,
          });

          await productRepository.save(productToEdit);
          res.status(200).json({ success: true, data: productToEdit });
        } else {
          res.status(404).json({ success: false, error: "Product not found" });
        }
      } else {
        res
          .status(400)
          .json({ succesS: false, error: "Missing required field" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: `${error}` });
    }
  }

  static async searchProducts(req: Request, res: Response) {
    try {
      const searchValue = req.query?.searchValue as string;
      const { startIndex, limit } = req.pagination;
      let query = productRepository.createQueryBuilder("product");

      const allProducts = await query.getMany();

      const filteredProducts = allProducts.filter((product) => {
        if (!searchValue) return true;

        const agePattern = new RegExp(searchValue, "i");
        return (
          product.title.includes(searchValue) ||
          product.description.includes(searchValue) ||
          agePattern.test(product.price.toString())
        );
      });

      const allProductsCount = filteredProducts.length;
      const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + limit
      );

      res.status(200).json({
        success: true,
        data: paginatedProducts,
        count: allProductsCount,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: `${error}` });
    }
  }
}
