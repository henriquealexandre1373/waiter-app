type ProductBody = {
  name?: string | number;
  description?: string | number;
  price?: string | number;
  industrialized?: boolean | number;
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

function createRequiredResponse(requiredProperty: string) {
  if (
    requiredProperty === 'ingredient name' ||
    requiredProperty === 'ingredient icon'
  ) {
    return [
      {
        path:
          requiredProperty === 'ingredient name'
            ? 'ingredients.0.name'
            : 'ingredients.0.icon',
        message: `The ${requiredProperty} is required`,
        code: 'invalid_type',
      },
    ];
  }
  return [
    {
      path: `${requiredProperty}`,
      message: `The ${requiredProperty} is required`,
      code: 'invalid_type',
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
};

export const validationErrors = {
  requiredName: createRequiredResponse('name'),
  requiredDescription: createRequiredResponse('description'),
  requiredPrice: createRequiredResponse('price'),
  noIngredientsName: createRequiredResponse('ingredient name'),
  noIngredientsIcon: createRequiredResponse('ingredient icon'),
};
