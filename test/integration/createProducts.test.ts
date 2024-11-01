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
import { Category } from '@src/app/models/Category';
import { Product } from '@src/app/models/Product';
// Utils
// import { createProductSetup } from './utils/createProductSetup';

let categoryId: string;

function generateValidationTest(
  body: Record<string, string | number | boolean>,
  description: string,
  expectedDetails: Array<object>
) {
  it(description, async () => {
    if (!body.category) {
      body.category = categoryId;
    }

    const { status, body: responseBody } = await request(app)
      .post('/products')
      .field(body)
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
    {
      body: productBodies.invalidTypeName,
      description: 'should fail when name is not a string --fail case',
      expectedDetails: validationErrors.invalidTypeName,
    },
    {
      body: productBodies.invalidTypeDescription,
      description: 'should fail when description is not a string --fail case',
      expectedDetails: validationErrors.invalidTypeDescription,
    },
    {
      body: productBodies.invalidTypePrice,
      description: 'should fail when price is not a string --fail case',
      expectedDetails: validationErrors.invalidTypePrice,
    },
    {
      body: productBodies.invalidTypeCategory,
      description: 'should fail when category is not a ObjectId --fail case',
      expectedDetails: validationErrors.invalidTypeCategory,
    },
    {
      body: productBodies.invalidTypeIngredientsName,
      description:
        'should fail when ingredients name is not a string --fail case',
      expectedDetails: validationErrors.invalidTypeIngredientsName,
    },
    {
      body: productBodies.invalidTypeIngredientsIcon,
      description:
        'should fail when ingredients icon is not a string --fail case',
      expectedDetails: validationErrors.invalidTypeIngredientsIcon,
    },
    {
      body: productBodies.invalidIndustrializedProduct,
      description:
        'should fail when industrialized product have ingredients --fail case',
      expectedDetails: validationErrors.invalidIndustrializedProduct,
    },
    {
      body: productBodies.invalidNotIndustrializedProduct,
      description:
        'should fail when not industrialized product do not have ingredients --fail case',
      expectedDetails: validationErrors.invalidNotIndustrializedProduct,
    },
  ];

  validationTestCases.forEach(({ body, description, expectedDetails }) =>
    generateValidationTest(body, description, expectedDetails)
  );

  it('should handle mongodb errors when finding one category normally --fail-case', async () => {
    const bodyToRequest = {
      ...productBodies.validNotIndustrialized,
      category: categoryId,
    };

    jest.spyOn(Category, 'findOne').mockImplementationOnce(() => {
      throw new Error();
    });

    const { status, body } = await request(app)
      .post('/products')
      .field(bodyToRequest)
      .attach('image', Buffer.from('mock file content'), 'test.png');
    expect(status).toBe(503);
    expect(body).toStrictEqual({
      error: 'Error on FindOne',
      message: 'Error Finding Category',
    });
  });

  it('should handle error when category not exists in database --fail-case', async () => {
    const bodyToRequest = {
      ...productBodies.validNotIndustrialized,
      category: '6724baeb3eeabf53569904bb',
    };

    const { status, body } = await request(app)
      .post('/products')
      .field(bodyToRequest)
      .attach('image', Buffer.from('mock file content'), 'test.png');
    expect(status).toBe(404);
    expect(body).toStrictEqual({
      error: 'Not Found',
      message: 'Category does not exist in the database',
    });
  });

  it('should handle error when product already exists in database --fail-case', async () => {
    const bodyToRequest = {
      ...productBodies.validNotIndustrialized,
      category: categoryId,
    };

    await request(app)
      .post('/products')
      .field(bodyToRequest)
      .attach('image', Buffer.from('mock file content'), 'test.png');

    const { status, body } = await request(app)
      .post('/products')
      .field(bodyToRequest)
      .attach('image', Buffer.from('mock file content'), 'test.png');
    expect(status).toBe(409);
    expect(body).toStrictEqual({
      error: 'Duplicated Properties',
      message: 'There is already a product with this name in this category',
    });
  });

  it('should handle mongodb errors when error on create product --fail-case', async () => {
    const bodyToRequest = {
      ...productBodies.validNotIndustrialized,
      category: categoryId,
    };

    jest.spyOn(Product, 'create').mockImplementationOnce(() => {
      throw new Error();
    });

    const { status, body } = await request(app)
      .post('/products')
      .field(bodyToRequest)
      .attach('image', Buffer.from('mock file content'), 'test.png');
    expect(status).toBe(503);
    expect(body).toStrictEqual({
      error: 'Error on Create',
      message: 'Error Creating Product',
    });
  });

  it('should handle mongodb errors when error on find product --fail-case', async () => {
    const bodyToRequest = {
      ...productBodies.validNotIndustrialized,
      category: categoryId,
    };

    jest.spyOn(Product, 'findOne').mockImplementationOnce(() => {
      throw new Error();
    });

    const { status, body } = await request(app)
      .post('/products')
      .field(bodyToRequest)
      .attach('image', Buffer.from('mock file content'), 'test.png');
    expect(status).toBe(503);
    expect(body).toStrictEqual({
      error: 'Error on FindOne',
      message: 'Error Finding Product',
    });
  });

  it('must be able to create a not industrialized product --success case', async () => {
    const bodyToRequest = {
      ...productBodies.validNotIndustrialized,
      category: categoryId,
    };

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

  it('must be able to create a industrialized product --success case', async () => {
    const bodyToRequest = {
      ...productBodies.validIndustrialized,
      category: categoryId,
    };

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
        industrialized: true,
        ingredients: [],
      })
    );
  });
});
