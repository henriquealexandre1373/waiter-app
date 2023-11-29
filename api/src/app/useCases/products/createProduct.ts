import { Request, Response } from 'express';

import { Product } from '../../models/Product';

export async function createProduct(req: Request, res: Response) {
  try {
    const imagePath = req.file?.filename;

    const { name, description, price, category, ingredients } = req.body;

    if (!imagePath) {
      return res
        .status(400)
        .json({ error: 'Required File', message: 'imagePath is required' });
    }

    if (!name || !description || !price || !category || !ingredients) {
      return res
        .status(400)
        .json({ error: 'Required Fields', message: 'All fields are required' });
    }

    const existProduct = await Product.findOne({ name, category });

    if (existProduct) {
      return res.status(409).json({
        error: 'Duplicated Products',
        message: 'There is already a product with this name in this category',
      });
    }

    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return res.status(400).json({
        error: 'Price Error',
        message: 'The price must be a number greater than zero',
      });
    }

    let parsedIngredients;
    try {
      parsedIngredients = JSON.parse(ingredients);
      if (!Array.isArray(parsedIngredients)) {
        throw new Error();
      }
    } catch (error) {
      return res.status(400).json({
        error: 'Ingredients Format',
        message: 'Ingredients must be provided in valid JSON array format',
      });
    }

    const product = await Product.create({
      name,
      description,
      imagePath,
      price: priceNumber,
      category,
      ingredients: parsedIngredients,
    });

    res.status(201).json(product);
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
