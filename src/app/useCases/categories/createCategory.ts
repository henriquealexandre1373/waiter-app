// Types
import { Request, Response } from 'express';
// Interfaces
import {
  createCategoryInDatabase,
  getCategoryInDatabase,
} from '@interfaces/database/MongoCategoryInterface';
// Validators
import { validateCreateCategory } from '@validators/createCategoryValidator';

export async function createCategory(req: Request, res: Response) {
  const { icon, name } = req.body;

  await validateCreateCategory(req.body);

  const existCategory = await getCategoryInDatabase(name);

  if (existCategory) {
    throw {
      type: 'DuplicatedResourceError',
      error: 'Duplicated Properties',
      message: 'A category with this name already exists',
    };
  }

  const category = await createCategoryInDatabase({ icon, name });

  res.status(201).json(category);
}
