import { z } from 'zod';

export const requiredString = (fieldName: string) =>
  z
    .string({ required_error: `The ${fieldName} is required` })
    .regex(/^(?!\d+$).+$/, {
      message: `The ${fieldName} cannot contain only numbers`,
    });
