import { Request, Response } from "express";
import { AppDataSource } from "../../../data_source";
import { Product } from "../../entities/Product";

const productRepository = AppDataSource.getRepository(Product);

// TODO: Add image implementation
export class ProductController {
  static async createProduct(
    req: Request,
    res: Response<Product | unknown>
  ): Promise<void> {
    try {
        const { name, description, category, sizes, price, availability_status, color } = req.body;

        const { id } = req.body.currentUser;
    
        const product = new Product();
        product.name = name;
        product.description = description;
        product.category = category;
        product.sizes = sizes;
        product.price = price;
        product.availability_status = availability_status;
        product.color = color;
        product.createdById = id;
        product.createdDate = new Date();
    
        await productRepository.save(product);
        res.status(201).json({ data: product, success: true });
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  }

  static async getProducts(req: Request, res: Response) {
    try {
      const { id } = req.body.currentUser;
      const { startIndex, limit } = req.pagination;

      const [allProducts, allProductsCount] = await Promise.all([
        productRepository.find({
          where: { createdById: id },
          order: { createdDate: "DESC" },
          skip: startIndex,
          take: limit,
        }),
        productRepository.count({
          where: { createdById: id },
        }),
      ]);

      res
        .status(200)
        .json({ success: true, data: allProducts, count: allProductsCount });
    } catch (error) {
      res.status(400).json({ error: `${error}` });
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
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, category, sizes, price, availability_status, color } = req.body;

        const productToEdit = await productRepository.findOneBy({
          id,
        });

        if (productToEdit) {
          Object.assign(productToEdit, {
            name,
            description,
            category,
            sizes,
            price,
            availability_status,
            color,
            lastModifiedDate: new Date(),
          });

          await productRepository.save(productToEdit);
          res.status(200).json({ success: true, data: productToEdit });
        } else {
        res.status(404).json({ success: false, error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  static async searchProducts(req: Request, res: Response) {
    try {
      const searchValue = req.query?.searchValue as string;
      const { id } = req.body.currentUser;
      const { startIndex, limit } = req.pagination;
      let query = productRepository
        .createQueryBuilder("product")
        .where("product.createdById = :id", { id })
        .orderBy("product.createdDate", "DESC");

      const allProducts = await query.getMany();

      const filteredProducts = allProducts.filter((product) => {
        if (!searchValue) return true;

        const pricePattern = new RegExp(searchValue, "i");
        return (
          product.name.includes(searchValue) ||
          product.category.includes(searchValue) ||
          pricePattern.test(product.price.toString())
        );
      });

      const allProductsCount = filteredProducts.length;
      const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + limit
      );

      res.status(200).json({ data: paginatedProducts, count: allProductsCount });
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }
}
