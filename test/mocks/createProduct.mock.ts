type ProductBody = {
  name?: string | number;
  description?: string | number;
  price?: string | number;
  category?: string;
  industrialized?: boolean;
  'ingredients[0][name]'?: string | number;
  'ingredients[0][icon]'?: string | number;
};

const validProductWithIngredientsBody = {
  name: 'test',
  description: 'just a test product',
  price: '100.0',
  industrialized: false,
  'ingredients[0][name]': 'jest',
  'ingredients[0][icon]': '🤖',
};

const validIndustrializedProductBody = {
  name: 'test',
  description: 'just a test product',
  price: '100.0',
  industrialized: true,
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
  validNotIndustrialized: validProductWithIngredientsBody,
  validIndustrialized: validIndustrializedProductBody,
  noName: createBodyWithoutSomeProperty(
    validProductWithIngredientsBody,
    'name'
  ),
  noDescription: createBodyWithoutSomeProperty(
    validProductWithIngredientsBody,
    'description'
  ),
  noPrice: createBodyWithoutSomeProperty(
    validProductWithIngredientsBody,
    'price'
  ),
  noIngredientsName: createBodyWithoutSomeProperty(
    validProductWithIngredientsBody,
    'ingredients[0][name]'
  ),
  noIngredientsIcon: createBodyWithoutSomeProperty(
    validProductWithIngredientsBody,
    'ingredients[0][icon]'
  ),
  invalidTypeName: { ...validProductWithIngredientsBody, name: 123 },
  invalidTypeDescription: {
    ...validProductWithIngredientsBody,
    description: 123,
  },
  invalidTypePrice: { ...validProductWithIngredientsBody, price: 'abc' },
  invalidTypeCategory: { ...validProductWithIngredientsBody, category: '123' },
  invalidTypeIngredientsName: {
    ...validProductWithIngredientsBody,
    'ingredients[0][name]': 123,
  },
  invalidTypeIngredientsIcon: {
    ...validProductWithIngredientsBody,
    'ingredients[0][icon]': 123,
  },
  invalidIndustrializedProduct: {
    ...validProductWithIngredientsBody,
    ...validIndustrializedProductBody,
  },
  invalidNotIndustrializedProduct: {
    ...validIndustrializedProductBody,
    industrialized: false,
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
  invalidTypeCategory: createInvalidTypeResponse(
    'category',
    'The category must be a valid ObjectId',
    'custom'
  ),
  invalidTypeIngredientsName: createInvalidTypeResponse('ingredient name'),
  invalidTypeIngredientsIcon: createInvalidTypeResponse(
    'ingredient icon',
    'The ingredient icon must be a valid emoji',
    'custom'
  ),
  invalidIndustrializedProduct: createInvalidTypeResponse(
    'ingredients',
    'Ingredients should not be provided if the product is industrialized',
    'custom'
  ),
  invalidNotIndustrializedProduct: createInvalidTypeResponse(
    'ingredients',
    'Ingredients must be provided if the product is not industrialized',
    'custom'
  ),
};
