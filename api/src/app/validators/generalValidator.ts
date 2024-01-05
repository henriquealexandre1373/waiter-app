import mongoose from 'mongoose';

export const validateObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);
