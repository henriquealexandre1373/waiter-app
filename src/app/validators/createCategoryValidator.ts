import { z } from 'zod';

const requiredString = (fieldName: string) =>
  z.string({ required_error: `The ${fieldName} is required` });

const isEmoji = (value: string) => {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
  return emojiRegex.test(value);
};

const CategorySchema = z.object({
  icon: requiredString('icon').refine(isEmoji, {
    message: 'The icon must be a valid emoji',
  }),
  name: requiredString('name').min(1),
});

type CategoryType = z.infer<typeof CategorySchema>;

async function validateCreateCategory(data: unknown) {
  return CategorySchema.parseAsync(data);
}

export { CategorySchema, CategoryType, validateCreateCategory };
