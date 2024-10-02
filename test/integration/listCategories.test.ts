import request from 'supertest';
import { app } from '@src/index';
import { Category } from '@src/app/models/Category';

const createCategoryFactory = async (
  category = { icon: '🤖', name: 'test' }
) => {
  await request(app).post('/categories').send(category);
};

describe('List Categories Tests', () => {
  it('must not a list categories because there is no category registered --fail-case', async () => {
    const { status, body } = await request(app).get('/categories');
    expect(status).toBe(404);
    expect(body).toStrictEqual({
      error: 'Not Found',
      message: 'No categories were found',
    });
  });

  it('should handle mongodb errors when listing categories normally --fail-case', async () => {
    jest.spyOn(Category, 'find').mockImplementationOnce(() => {
      throw new Error('Simulated Database Error');
    });

    const { status, body } = await request(app).get('/categories');
    expect(status).toBe(503);
    expect(body).toStrictEqual({
      error: 'Error on Find',
      message: 'Simulated Database Error',
    });
  });

  it('must list categories --success-case', async () => {
    const categoryData = {
      icon: '🤖',
      name: 'test',
    };
    await createCategoryFactory(categoryData);

    const { status, body } = await request(app).get('/categories');
    expect(status).toBe(200);
    expect(body[0].icon).toStrictEqual(categoryData.icon);
    expect(body[0].name).toStrictEqual(categoryData.name);
  });
});
