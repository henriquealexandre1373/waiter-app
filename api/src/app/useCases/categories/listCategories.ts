import { Request, Response } from 'express';

import { Category } from '../../models/Category';

export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await Category.find();

    if(!categories) {
      return res
        .status(404)
        .json({
          error: 'Categories Not Found',
          message: 'No categories were found',
        });
    }

    res.json(categories);
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
