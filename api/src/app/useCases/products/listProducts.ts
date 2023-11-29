import { Request, Response } from 'express';

import { Product } from '../../models/Product';

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await Product.find();

    if(!products) {
      return res
        .status(404)
        .json({
          error: 'Products Not Found',
          message: 'No products were found',
        });
    }

    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.name,
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
        message: 'An unknown error has occurred',
      });
    }
  }
}
