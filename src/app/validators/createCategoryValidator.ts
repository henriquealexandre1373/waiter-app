import { getCategoryInDatabase } from '../interfaces/database/MongoCategoryInterface';

/**
 * Validates the creation of a category.
 *
 * This function checks whether the provided icon and name meet the required criteria for category creation.
 * It also ensures that a category with the given name doesn't already exist in the database.
 *
 * @param {string} icon - The icon for the category.
 * @param {string} name - The name of the category.
 *
 * @throws {object} Throws an exception if validation fails, including:
 *   - type: 'RequiredResourceError' if icon or name is missing.
 *   - type: 'DuplicatedResourceError' if a category with the provided name already exists.
 *
 * @returns {Promise<void>} Resolves if validation is successful; otherwise, an exception is thrown.
 */
export async function createCategoryValidator(
  icon: string,
  name: string
): Promise<void> {
  // Check if icon and name are provided
  if (!icon || !name) {
    throw {
      type: 'RequiredResourceError',
      error: 'Required Properties',
      message: 'Properties icon and name are required',
    };
  }

  // Check if a category with the given name already exists
  const existCategory = await getCategoryInDatabase(name);

  if (existCategory) {
    throw {
      type: 'DuplicatedResourceError',
      error: 'Duplicated Properties',
      message: 'A category with this name already exists',
    };
  }

  return;
}
