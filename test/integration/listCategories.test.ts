// Libs
import request from 'supertest';
// Server
import { app } from '@src/index';
// Models
import { Category } from '@models/Category';
// Mocks
import { categoryBodies } from '@mocks/createCategory.mock';

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
    const category = categoryBodies['valid'];

    await request(app).post('/categories').send(category);

    const { status, body } = await request(app).get('/categories');
    expect(status).toBe(200);
    expect(body[0].icon).toStrictEqual(category.icon);
    expect(body[0].name).toStrictEqual(category.name);
  });
});
