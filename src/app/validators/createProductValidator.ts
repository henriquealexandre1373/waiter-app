import { isEmoji, isObjectId } from './generalValidator';

import { z } from 'zod';
import { requiredString } from './utils/required-error';

const ingredientsSchema = z.object({
  name: requiredString('ingredient name').min(1).max(50),
  icon: z
    .string({ required_error: 'The ingredient icon is required' })
    .refine(isEmoji, {
      message: 'The ingredient icon must be a valid emoji',
    }),
});

const ProductSchema = z
  .object({
    name: requiredString('name').min(1),
    description: requiredString('description').min(1),
    price: z.preprocess(
      (price) => {
        if (typeof price === 'string' || typeof price === 'number') {
          const parsedPrice = parseFloat(price.toString());
          return isNaN(parsedPrice) ? null : parsedPrice;
        }

        return undefined;
      },
      z
        .number({ required_error: 'The price is required' })
        .positive({ message: 'Price must be a positive number' })
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
