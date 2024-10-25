// Libs
import request from 'supertest';
// Server
import { app } from '@src/index';
// Mocks
import {
  productBodies,
  validationErrors,
} from '@test/mocks/createProduct.mock';
import { categoryBodies } from '@test/mocks/createCategory.mock';
// Utils
// import { createProductSetup } from './utils/createProductSetup';

let categoryId: string;

function generateValidationTest(
  body: Record<string, string | number | boolean>,
  description: string,
  expectedDetails: Array<object>
) {
  it(description, async () => {
    const { status, body: responseBody } = await request(app)
      .post('/products')
      .field({ ...body, category: categoryId })
      .attach('image', Buffer.from('mock file content'), 'test.png');
    expect(status).toBe(400);
    expect(responseBody.error).toBe('Validation Error');
    expect(responseBody.details).toStrictEqual(expectedDetails);
  });
}

describe('Create Products Tests', () => {
  beforeEach(async () => {
    const category = categoryBodies['valid'];
    const response = await request(app).post('/categories').send(category);

    categoryId = response.body._id;
  });

  const validationTestCases = [
    {
      body: productBodies.noName,
      description: 'should fail when no name is provided --fail case',
      expectedDetails: validationErrors.requiredName,
    },
    {
      body: productBodies.noDescription,
      description: 'should fail when no description is provided --fail case',
      expectedDetails: validationErrors.requiredDescription,
    },
    {
      body: productBodies.noPrice,
      description: 'should fail when no price is provided --fail case',
      expectedDetails: validationErrors.requiredPrice,
    },
    {
      body: productBodies.noIngredientsName,
      description:
        'should fail when no ingredients name is provided --fail case',
      expectedDetails: validationErrors.noIngredientsName,
    },
    {
      body: productBodies.noIngredientsIcon,
      description:
        'should fail when no ingredients icon is provided --fail case',
      expectedDetails: validationErrors.noIngredientsIcon,
    },
  ];

  validationTestCases.forEach(({ body, description, expectedDetails }) =>
    generateValidationTest(body, description, expectedDetails)
  );

  it('must be able to create products --success case', async () => {
    const bodyToRequest = { ...productBodies.valid, category: categoryId };

    const { statusCode, body } = await request(app)
      .post('/products')
      .field(bodyToRequest)
      .attach('image', Buffer.from('mock file content'), 'test.png');

    expect(statusCode).toBe(201);
    expect(body).toEqual(
      expect.objectContaining({
        name: 'test',
        description: 'just a test product',
        price: 100,
        industrialized: false,
        ingredients: [
          expect.objectContaining({
            name: 'jest',
            icon: '🤖',
          }),
        ],
      })
    );
  });
});
