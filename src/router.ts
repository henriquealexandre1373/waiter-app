import path from 'node:path';
import fs from 'fs';

import { Router } from 'express';
import multer from 'multer';

import { listCategories } from '@useCases/categories/listCategories';
import { createCategory } from '@useCases/categories/createCategory';
import { listProducts } from '@useCases/products/listProducts';
import { createProduct } from '@useCases/products/createProduct';
import { asyncHandler } from '@interfaces/http/middlewares/asyncHandlerMiddleware';

export const router = Router();

const isTestEnv = process.env.NODE_ENV === 'test';

const tempDir = path.resolve(__dirname, '..', 'tmp');

const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      if (isTestEnv) {
        ensureDirExists(tempDir);
        callback(null, path.resolve(__dirname, '..', 'tmp'));
      } else {
        callback(null, path.resolve(__dirname, '..', 'uploads'));
      }
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// List categories
router.get('/categories', asyncHandler(listCategories));

// Create category
router.post('/categories', asyncHandler(createCategory));

// List products
router.get('/products', asyncHandler(listProducts));

// Create product
router.post('/products', upload.single('image'), asyncHandler(createProduct));

// Get products by category
router.get('/categories/:categoryId/products', (req, res) => {
  res.send('OK');
});

// List orders
router.get('/orders', (req, res) => {
  res.send('OK');
});

// Create order
router.post('/orders', (req, res) => {
  res.send('OK');
});

// Change order status
router.patch('/orders/:orderId', (req, res) => {
  res.send('OK');
});

// Delete/cancel order
router.delete('/orders/:orderId', (req, res) => {
  res.send('OK');
});
