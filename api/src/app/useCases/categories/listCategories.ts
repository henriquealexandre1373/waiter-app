import { Request, Response } from 'express';

import { getCategoriesInDatabase } from '@interfaces/database/MongoCategoryInterface';

export async function listCategories(req: Request, res: Response) {
  const categories = await getCategoriesInDatabase();

  if (categories.length === 0) {
    throw {
      type: 'NotFoundError',
      error: 'Not Found',
      message: 'No categories were found',
    };
  }

  return res.json(categories);
}
