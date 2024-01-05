/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateProductItens } from '../types/CreateProductItens';
import { validateObjectId } from './generalValidator';

export function createProductValidator(itens: CreateProductItens) {
  const iterableItens: { key: string; value: any }[] = [];

  for (const key in itens) {
    iterableItens.push({
      key: key,
      value: itens[key as keyof CreateProductItens],
    });
  }

  iterableItens.forEach((item) => {
    const { key, value } = item;

    if (key === 'ingredients') {
      return;
    }

    if (!value && key === 'imagePath') {
      throw {
        type: 'RequiredResourceError',
        message: `${key} is a required file`,
      };
    }

    if (!value) {
      throw {
        type: 'RequiredResourceError',
        message: `${key} is a required field`,
      };
    }
  });

  const { ingredients, industrialized, category, price } = itens;

  if (industrialized === false && (!ingredients || ingredients.length === 0)) {
    throw {
      type: 'RequiredResourceError',
      message: 'ingredients is a required file',
    };
  }

  const categoryIsValid = validateObjectId(category);

  if (!categoryIsValid) {
    throw {
      type: 'TypeError',
      message: 'category must be a ObjectId',
    };
  }

  if (isNaN(price) || price <= 0) {
    throw {
      type: 'TypeError',
      message: 'The price must be a number greater than zero',
    };
  }

  return {
    ...itens,
    ingredients: industrialized === true ? [] : ingredients,
  };
}
