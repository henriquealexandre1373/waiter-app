// Libs
import request from 'supertest';
// Server
import { app } from '@src/index';
// Mocks
import { categoryBodies } from '@test/mocks/createCategory.mock';

export const createProductSetup = async () => {
  const category = categoryBodies['valid'];
  const response = await request(app).post('/categories').send(category);

  const categoryId = response.body._id;

  await request(app)
    .post('/products')
    .field({
      name: 'test',
      description: 'just a test product',
      price: '100.0',
      industrialized: false,
      category: categoryId,
      'ingredients[0][name]': 'jest',
      'ingredients[0][icon]': '🤖',
    })
    .attach('image', Buffer.from('mock file content'), 'test.png');
};
