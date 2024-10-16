// Types
import { CategoryType } from '@src/app/validators/createCategoryValidator';
// Models
import { Category } from '@models/Category';
// Services
import logger from '@services/loggerService';

type getCategoryInDatabaseType = {
  name?: string;
  _id?: string;
};

export const getCategoriesInDatabase = async () => {
  try {
    return await Category.find().lean();
  } catch (error: unknown) {
    throw {
      type: 'DataBaseError',
      error: 'Error on Find',
      message: (error as Error).message || 'Error Finding Categories',
    };
  }
};

export const getCategoryInDatabase = async (
  filter: getCategoryInDatabaseType
) => {
  try {
    return await Category.findOne(filter).lean();
  } catch (error: unknown) {
    throw {
      type: 'DataBaseError',
      error: 'Error on FindOne',
      message: (error as Error).message || 'Error Finding Category',
    };
  }
};

export const createCategoryInDatabase = async (
  categoryToCreate: CategoryType
) => {
  try {
    const createdCategory = await Category.create(categoryToCreate);
    logger.info(`Category created successfully: ${categoryToCreate.name}`);
    return createdCategory;
  } catch (error: unknown) {
    throw {
      type: 'DataBaseError',
      error: 'Error on Create',
      message: (error as Error).message || 'Error Creating Category',
    };
  }
};
