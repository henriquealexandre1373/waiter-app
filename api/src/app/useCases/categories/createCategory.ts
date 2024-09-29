// Types
import { Request, Response } from 'express'
// Interfaces
import { createCategoryInDatabase } from '../../interfaces/database/MongoCategoryInterface'
// Validators
import { createCategoryValidator } from '../../validators/createCategoryValidator'

export async function createCategory(req: Request, res: Response) {
  const { icon, name } = req.body

  await createCategoryValidator(icon, name)

  const category = await createCategoryInDatabase({ icon, name })

  res.status(201).json(category)
}
