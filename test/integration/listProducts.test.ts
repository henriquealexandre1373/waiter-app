// Libs
import request from 'supertest';
// Server
import { app } from '@src/index';
// Models
import { Product } from '@models/Product';
// Utils
import { createProductSetup } from './utils/createProductSetup';

describe('List Products Tests', () => {
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
    await createProductSetup();

    const { status, body } = await request(app).get('/products');
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });
});
