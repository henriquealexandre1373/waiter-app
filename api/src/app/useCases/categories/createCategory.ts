import { Request, Response } from 'express';

import { Category } from '../../models/Category';

export async function createCategory(req: Request, res: Response) {
  try {
    const { icon, name } = req.body;

    if (!icon || !name) {
      return res
        .status(400)
        .json({
          error: 'Invalid Input Data',
          message: 'Properties icon and name are required',
        });
    }

    const existCategory = await Category.findOne({ name });

    if (existCategory) {
      return res
        .status(409)
        .json({
          error: 'Duplicated Categories',
          message: 'A category with this name already exists',
        });
    }

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
