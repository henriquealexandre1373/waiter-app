import { z } from 'zod';
import { requiredString } from './utils/required-error';
import { isEmoji } from './generalValidator';

const CategorySchema = z.object({
  icon: requiredString('icon').refine(isEmoji, {
    message: 'The icon must be a valid emoji',
  }),
  name: requiredString('name').min(1),
});

type CategoryType = z.infer<typeof CategorySchema>;

function validateCreateCategory(data: unknown) {
  return CategorySchema.parse(data);
}

export { CategorySchema, CategoryType, validateCreateCategory };
