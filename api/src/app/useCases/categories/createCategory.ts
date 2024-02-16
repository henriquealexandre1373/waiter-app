import { Request, Response } from 'express';

import { createCategoryValidator } from '../../validators/createCategoryValidator';
import { Category } from '../../models/Category';

export async function createCategory(req: Request, res: Response) {
  try {
    const { icon, name } = req.body;

    await createCategoryValidator(icon, name);

    const category = await Category.create({ icon, name });

    res.status(201).json(category);
  } catch (error: unknown) {
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
