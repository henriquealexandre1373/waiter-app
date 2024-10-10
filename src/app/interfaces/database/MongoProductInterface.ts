// Types
import { ProductType } from '@validators/createProductValidator';
type FindProductType = Pick<ProductType, 'category' | 'name'>;
// Models
import { Product } from '@models/Product';
// Services
import logger from '@services/loggerService';

export const getProductsInDatabase = async () => {
  try {
    return await Product.find().lean();
  } catch (error: unknown) {
    throw {
      type: 'DataBaseError',
      error: 'Error on Find',
      message: (error as Error).message || 'Error Finding Products',
    };
  }
};

export const getProductInDatabase = async (filter: FindProductType) => {
  try {
    return await Product.findOne(filter).lean();
  } catch (error: unknown) {
    throw {
      type: 'DataBaseError',
      error: 'Error on FindOne',
      message: (error as Error).message || 'Error Finding Product',
    };
  }
};

export const createProductInDatabase = async (productToCreate: ProductType) => {
  try {
    const createdProduct = await Product.create(productToCreate);
    logger.info(`Product created successfully: ${productToCreate.name}`);
    return createdProduct;
  } catch (error: unknown) {
    throw {
      type: 'DataBaseError',
      error: 'Error on Create',
      message: (error as Error).message || 'Error Creating Product',
    };
  }
};
