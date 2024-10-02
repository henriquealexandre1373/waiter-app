import { ProductType } from '../customTypes/Product';
import { validateObjectId } from './generalValidator';

/**
 * Validates the creation of a product.
 *
 * This function checks whether the provided items meet the required criteria for product creation.
 * It performs various validations on the input items, throwing exceptions for specific validation failures.
 *
 * @param {CreateProductItems} items - An object containing properties for product creation.
 *
 * @throws {object} Throws exceptions if validation fails, including:
 *   - type: 'RequiredResourceError' if a required field is missing.
 *   - type: 'TypeError' if a field has an invalid type.
 *
 * @returns {CreateProductItems} Returns the validated items if validation is successful.
 */
export function createProductValidator(items: ProductType) {
  // Creating and typing array that receives items in key-value format
  const iterableItems: {
    key: string;
    value: string | number | boolean | string[] | undefined;
  }[] = [];

  // Converting each 'items' property to an object with key-value of to facilitate validation
  for (const key in items) {
    iterableItems.push({
      key: key,
      value: items[key as keyof ProductType],
    });
  }

  // Validating each item in the iterable
  iterableItems.forEach((item) => {
    const { key, value } = item;

    // Ignoring ingredients because it will be validated later
    if (key === 'ingredients') {
      return;
    }

    // Returning an exclusive exception if there is no imagePath
    if (!value && key === 'imagePath') {
      throw {
        type: 'RequiredResourceError',
        error: 'Required Property',
        message: 'imagePath is a required file',
      };
    }

    // Returning an exception if not have other items
    if (!value) {
      throw {
        type: 'RequiredResourceError',
        error: 'Required Property',
        message: `${key} is a required field`,
      };
    }
  });

  const { ingredients, industrialized, category, price } = items;

  // Validating and returning an exception if the product is not industrialized and has no ingredients
  if (industrialized === false && (!ingredients || ingredients.length === 0)) {
    throw {
      type: 'RequiredResourceError',
      error: 'Required Property',
      message: 'ingredients is a required field',
    };
  }

  // Validating if category is 'ObjectId'
  const categoryIsValid = validateObjectId(category);

  // Returning an exception if it is not
  if (!categoryIsValid) {
    throw {
      type: 'TypeError',
      error: 'Invalid Type',
      message: 'category must be a ObjectId',
    };
  }

  // Validating and returning an exception if price is not a number or is not a number greater than 0
  if (isNaN(price) || price <= 0) {
    throw {
      type: 'TypeError',
      error: 'Invalid Type',
      message: 'The price must be a number greater than zero',
    };
  }

  return {
    ...items,
    // If the product is industrialized, ingredients are not necessary
    ingredients: industrialized === true ? [] : ingredients,
  };
}
