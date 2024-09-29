// Types
import { Request, Response } from 'express'
// Interfaces
import { getProductsInDatabase } from '../../interfaces/database/MongoProductInterface'

export async function listProducts(req: Request, res: Response) {
  const products = await getProductsInDatabase()

  if (products.length === 0) {
    throw {
      type: 'NotFoundError',
      error: 'Not Found',
      message: 'No products were found',
    }
  }

  res.json(products)
}
