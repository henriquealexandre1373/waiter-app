type CategoryBody = {
  icon?: string | number;
  name?: string | number;
};

export const categoryBodies: Record<string, CategoryBody> = {
  valid: { icon: '🤖', name: 'test' },
  noIcon: { name: 'test' },
  noName: { icon: '🤖' },
  invalidEmojiIcon: { icon: '123', name: 'test' },
  invalidTypeIcon: { icon: 123, name: 'test' },
  invalidTypeName: { icon: '🤖', name: 123 },
  // emptyBody: {},
};

export const validationErrors = {
  requiredIcon: [
    {
      path: 'icon',
      message: 'The icon is required',
      code: 'invalid_type',
    },
  ],
  requiredName: [
    {
      path: 'name',
      message: 'The name is required',
      code: 'invalid_type',
    },
  ],
  invalidEmojiIcon: [
    {
      path: 'icon',
      message: 'The icon must be a valid emoji',
      code: 'custom',
    },
  ],
  invalidTypeIcon: [
    {
      path: 'icon',
      message: 'Expected string, received number',
      code: 'invalid_type',
    },
  ],
  invalidTypeName: [
    {
      path: 'name',
      message: 'Expected string, received number',
      code: 'invalid_type',
    },
  ],
};
