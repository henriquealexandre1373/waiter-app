// Types
import { Request, Response } from 'express'
import { ProductType } from '../../types/Product'
// Validators
import { createProductValidator } from '../../validators/createProductValidator'
import { getCategoryInDatabase } from '../../interfaces/database/MongoCategoryInterface'
// Interfaces
import {
  createProductInDatabase,
  getProductInDatabase,
} from '../../interfaces/database/MongoProductInterface'

export async function createProduct(req: Request, res: Response) {
  const items: ProductType = {
    name: req.body?.name,
    description: req.body?.description,
    price: Number(req.body?.price),
    category: req.body?.category,
    ingredients: req.body?.ingredients,
    industrialized: Boolean(req.body?.industrialized),
    imagePath: req.file?.filename,
  }

  const {
    name,
    description,
    price,
    category,
    ingredients,
    industrialized,
    imagePath,
  } = createProductValidator(items)

  const existCategory = await getCategoryInDatabase(category)

  if (!existCategory) {
    throw {
      type: 'NotFoundError',
      error: 'Not Found',
      message: 'Category does not exist in the database',
    }
  }

  const existProduct = await getProductInDatabase({ name, category })

  if (existProduct) {
    throw {
      type: 'DuplicatedResourceError',
      error: 'Duplicated Properties',
      message: 'There is already a product with this name in this category',
    }
  }

  const product = await createProductInDatabase({
    name,
    description,
    price,
    category,
    ingredients,
    industrialized,
    imagePath,
  })

  res.status(201).json(product)
}
