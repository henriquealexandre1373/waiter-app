// Types
import { Request, Response } from 'express';
// import { ProductType } from '@customTypes/Product';
// Validators
import { validateCreateProduct } from '@validators/createProductValidator';
import { getCategoryInDatabase } from '@interfaces/database/MongoCategoryInterface';
// Interfaces
import {
  createProductInDatabase,
  getProductInDatabase,
} from '@interfaces/database/MongoProductInterface';

export async function createProduct(req: Request, res: Response) {
  const {
    name,
    description,
    price,
    category,
    ingredients,
    industrialized,
    imagePath,
  } = await validateCreateProduct({
    ...req.body,
    imagePath: req.file?.filename,
  });

  const existCategory = await getCategoryInDatabase(category);

  if (!existCategory) {
    throw {
      type: 'NotFoundError',
      error: 'Not Found',
      message: 'Category does not exist in the database',
    };
  }

  const existProduct = await getProductInDatabase({ name, category });

  if (existProduct) {
    throw {
      type: 'DuplicatedResourceError',
      error: 'Duplicated Properties',
      message: 'There is already a product with this name in this category',
    };
  }

  const product = await createProductInDatabase({
    name,
    description,
    price,
    category,
    ingredients,
    industrialized,
    imagePath,
  });

  res.status(201).json(product);
}
