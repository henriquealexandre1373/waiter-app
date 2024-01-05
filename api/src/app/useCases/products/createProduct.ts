// Types
import { Request, Response } from 'express';
import { CreateProductItems } from '../../types/CreateProductItems';
// Models
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';
// Validators
import { createProductValidator } from '../../validators/createProductValidator';
// Helpers
import { handleError } from '../../helpers/handleError';

export async function createProduct(req: Request, res: Response) {
  try {
    const items: CreateProductItems = {
      name: req.body?.name,
      description: req.body?.description,
      price: Number(req.body?.price),
      category: req.body?.category,
      ingredients: req.body?.ingredients,
      industrialized: Boolean(req.body?.industrialized),
      imagePath: req.file?.filename,
    };

    const {
      name,
      description,
      price,
      category,
      ingredients,
      industrialized,
      imagePath,
    } = createProductValidator(items);

    const existCategory = await Category.findOne({ _id: category }).lean();

    if (!existCategory) {
      throw {
        type: 'NotFoundError',
        message: 'category not found',
      };
    }

    const existProduct = await Product.findOne({ name, category });

    if (existProduct) {
      throw {
        type: 'DuplicatedResourceError',
        message: 'There is already a product with this name in this category',
      };
    }

    const product = await Product.create({
      name,
      description,
      imagePath,
      price,
      category,
      industrialized,
      ingredients,
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.name,
        message: error.message,
      });
    }

    const { status, message, type } = handleError(error);

    res.status(status).json({ error: type, message });
  }
}
