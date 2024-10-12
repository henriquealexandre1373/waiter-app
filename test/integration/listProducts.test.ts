// Libs
import request from 'supertest';
// Server
import { app } from '@src/index';
// Models
import { Product } from '@models/Product';
// Mocks
import { categoryBodies } from '@mocks/createCategory.mock';

describe('List Products Tests', () => {
  let setupComplete = false;

  const setupTestData = async () => {
    if (!setupComplete) {
      const category = categoryBodies['valid'];
      const response = await request(app).post('/categories').send(category);

      const { _id } = response.body;

      await request(app)
        .post('/products')
        .field('name', 'test')
        .field('description', 'just a test product')
        .field('price', '100.0')
        .field('industrialized', 'false')
        .field('category', _id)
        .field('ingredients[0][name]', 'jest')
        .field('ingredients[0][icon]', '🤖')
        .attach('image', Buffer.from('mock file content'), 'test.png');
      setupComplete = true;
    }
  };

  it('must not a list products because there is no product registered --fail-case', async () => {
    const { status, body } = await request(app).get('/products');
    expect(status).toBe(404);
    expect(body).toStrictEqual({
      error: 'Not Found',
      message: 'No products were found',
    });
  });

  it('should handle mongodb errors when listing products normally --fail-case', async () => {
    const errorMessage = 'Simulated finding products database error';
    jest.spyOn(Product, 'find').mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const { status, body } = await request(app).get('/products');
    expect(status).toBe(503);
    expect(body).toStrictEqual({
      error: 'Error on Find',
      message: errorMessage,
    });
  });

  it('must list products --success-case', async () => {
    await setupTestData();
    const { status, body } = await request(app).get('/products');
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });
});
