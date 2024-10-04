// Libs
import request from 'supertest';
// Server
import { app } from '@src/index';
// Models
import { Category } from '@src/app/models/Category';
// Mocks
import {
  categoryBodies,
  validationErrors,
} from '@test/mocks/createCategory.mock';
// Utils
function generateValidationTest(
  body: Record<string, string | number>,
  description: string,
  expectedDetails: Array<object>
) {
  it(description, async () => {
    const { status, body: responseBody } = await request(app)
      .post('/categories')
      .send(body);
    expect(status).toBe(400);
    expect(responseBody.error).toBe('Validation Error');
    expect(responseBody.details).toStrictEqual(expectedDetails);
  });
}

describe('Create Category Tests', () => {
  const validationTestCases = [
    {
      body: categoryBodies.noIcon,
      description: 'should fail when no icon is provided --fail case',
      expectedDetails: validationErrors.requiredIcon,
    },
    {
      body: categoryBodies.noName,
      description: 'should fail when no name is provided --fail case',
      expectedDetails: validationErrors.requiredName,
    },
    {
      body: categoryBodies.invalidEmojiIcon,
      description: 'should fail when icon is not a valid emoji --fail case',
      expectedDetails: validationErrors.invalidEmojiIcon,
    },
    {
      body: categoryBodies.invalidTypeIcon,
      description: 'should fail when icon is not a string --fail case',
      expectedDetails: validationErrors.invalidTypeIcon,
    },
    {
      body: categoryBodies.invalidTypeName,
      description: 'should fail when name is not a string --fail case',
      expectedDetails: validationErrors.invalidTypeName,
    },
    {
      body: categoryBodies.emptyBody,
      description: 'should fail when body is empty --fail case',
      expectedDetails: [
        validationErrors.requiredIcon,
        validationErrors.requiredName,
      ].flat(),
    },
  ];

  validationTestCases.forEach(({ body, description, expectedDetails }) =>
    generateValidationTest(body, description, expectedDetails)
  );

  it('should handle mongodb errors when finding one category normally --fail-case', async () => {
    const category = categoryBodies['valid'];
    jest.spyOn(Category, 'findOne').mockImplementationOnce(() => {
      throw new Error('Simulated Database Error');
    });

    const { status, body } = await request(app)
      .post('/categories')
      .send(category);
    expect(status).toBe(503);
    expect(body).toStrictEqual({
      error: 'Error on FindOne',
      message: 'Simulated Database Error',
    });
  });

  it('should handle mongodb errors when create a category normally --fail-case', async () => {
    const category = categoryBodies['valid'];
    jest.spyOn(Category, 'create').mockImplementationOnce(() => {
      throw new Error('Simulated Database Error');
    });

    const { status, body } = await request(app)
      .post('/categories')
      .send(category);
    expect(status).toBe(503);
    expect(body).toStrictEqual({
      error: 'Error on Create',
      message: 'Simulated Database Error',
    });
  });

  it('must not be a create category, because already exists --fail-case', async () => {
    const category = categoryBodies['valid'];
    await request(app).post('/categories').send(category);

    const { status, body } = await request(app)
      .post('/categories')
      .send(category);
    expect(status).toBe(409);
    expect(body.error).toBe('Duplicated Properties');
    expect(body.message).toBe('A category with this name already exists');
  });

  it('must create category --success-case', async () => {
    const category = categoryBodies['valid'];
    const { status, body } = await request(app)
      .post('/categories')
      .send(category);
    expect(status).toBe(201);
    expect(body.icon).toStrictEqual(category.icon);
    expect(body.name).toStrictEqual(category.name);
  });
});
