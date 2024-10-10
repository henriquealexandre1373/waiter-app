import mongoose from 'mongoose';

export const isObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

export const isEmoji = (value: string) => {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
  return emojiRegex.test(value);
};
