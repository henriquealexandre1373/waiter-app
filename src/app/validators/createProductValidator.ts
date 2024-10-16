import { isEmoji, isObjectId } from './generalValidator';

import { z } from 'zod';
import { requiredString } from './utils/required-error';

const ingredientsSchema = z.object({
  name: requiredString('ingredient name').min(1),
  icon: requiredString('ingredient icon').refine(isEmoji, {
    message: 'The ingredient icon must be a valid emoji',
  }),
});

const ProductSchema = z
  .object({
    name: requiredString('name').min(1),
    description: requiredString('description').min(1),
    price: z.preprocess(
      (price) => parseFloat(price as string),
      z.number().positive({ message: 'Price must be a positive number' })
    ),
    category: requiredString('category').refine(isObjectId, {
      message: 'The category must be a valid ObjectId',
    }),
    ingredients: z.preprocess((ingredients) => {
      if (typeof ingredients === 'string') {
        try {
          return JSON.parse(ingredients);
        } catch {
          return [];
        }
      }
      return ingredients;
    }, z.array(ingredientsSchema).optional().default([])),
    industrialized: z.preprocess(
      (industrialized) => industrialized === 'true' || industrialized === true,
      z.boolean().default(false)
    ),
    imagePath: z.string().optional(),
  })
  .superRefine(({ industrialized, ingredients }, ctx) => {
    if (industrialized && ingredients.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Ingredients should not be provided if the product is industrialized',
        path: ['ingredients'],
      });
    } else if (!industrialized && ingredients.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Ingredients must be provided if the product is not industrialized',
        path: ['ingredients'],
      });
    }
  });

type ProductType = z.infer<typeof ProductSchema>;

async function validateCreateProduct(data: unknown) {
  return ProductSchema.parseAsync(data);
}

export { ProductSchema, ProductType, validateCreateProduct };
