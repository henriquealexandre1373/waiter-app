type ProductBody = {
  name?: string | number;
  description?: string | number;
  price?: string | number;
  industrialized?: boolean;
  'ingredients[0][name]'?: string | number;
  'ingredients[0][icon]'?: string | number;
};

const validProductBody = {
  name: 'test',
  description: 'just a test product',
  price: '100.0',
  industrialized: false,
  'ingredients[0][name]': 'jest',
  'ingredients[0][icon]': '🤖',
};

function createBodyWithoutSomeProperty(
  body: ProductBody,
  excludeKey: keyof ProductBody
): ProductBody {
  const { [excludeKey]: _, ...rest } = body;
  return { ...rest };
}

const propertyPaths: Record<string, string> = {
  name: 'name',
  description: 'description',
  price: 'price',
  'ingredient name': 'ingredients.0.name',
  'ingredient icon': 'ingredients.0.icon',
};

function createRequiredResponse(requiredProperty: string) {
  return [
    {
      path: propertyPaths[requiredProperty] || requiredProperty,
      message: `The ${requiredProperty} is required`,
      code: 'invalid_type',
    },
  ];
}

function createInvalidTypeResponse(
  invalidProperty: string,
  customMessage: string = '',
  customCode: string = ''
) {
  return [
    {
      path: propertyPaths[invalidProperty] || invalidProperty,
      message:
        customMessage || `The ${invalidProperty} cannot contain only numbers`,
      code: customCode || 'invalid_string',
    },
  ];
}

export const productBodies: Record<string, ProductBody> = {
  valid: validProductBody,
  noName: createBodyWithoutSomeProperty(validProductBody, 'name'),
  noDescription: createBodyWithoutSomeProperty(validProductBody, 'description'),
  noPrice: createBodyWithoutSomeProperty(validProductBody, 'price'),
  noIngredientsName: createBodyWithoutSomeProperty(
    validProductBody,
    'ingredients[0][name]'
  ),
  noIngredientsIcon: createBodyWithoutSomeProperty(
    validProductBody,
    'ingredients[0][icon]'
  ),
  invalidTypeName: { ...validProductBody, name: 123 },
  invalidTypeDescription: { ...validProductBody, description: 123 },
  invalidTypePrice: { ...validProductBody, price: 'abc' },
  invalidTypeIngredientsName: {
    ...validProductBody,
    'ingredients[0][name]': 123,
  },
  invalidTypeIngredientsIcon: {
    ...validProductBody,
    'ingredients[0][icon]': 123,
  },
};

export const validationErrors = {
  requiredName: createRequiredResponse('name'),
  requiredDescription: createRequiredResponse('description'),
  requiredPrice: createRequiredResponse('price'),
  noIngredientsName: createRequiredResponse('ingredient name'),
  noIngredientsIcon: createRequiredResponse('ingredient icon'),
  invalidTypeName: createInvalidTypeResponse('name'),
  invalidTypeDescription: createInvalidTypeResponse('description'),
  invalidTypePrice: createInvalidTypeResponse(
    'price',
    'Expected number, received null',
    'invalid_type'
  ),
  invalidTypeIngredientsName: createInvalidTypeResponse('ingredient name'),
  invalidTypeIngredientsIcon: createInvalidTypeResponse(
    'ingredient icon',
    'The ingredient icon must be a valid emoji',
    'custom'
  ),
};
