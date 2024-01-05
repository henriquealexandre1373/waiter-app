export function handleError(error: unknown) {
  const baseError = {
    type: (error as { type?: string }).type,
    message: (error as { message?: string }).message,
  };

  switch (baseError.type) {
  case 'RequiredResourceError':
    return { ...baseError, status: 400 };
  case 'TypeError':
    return { ...baseError, status: 400 };
  case 'DuplicatedResourceError':
    return { ...baseError, status: 409 };
  case 'NotFoundError':
    return { ...baseError, status: 404 };
  default:
    return {
      status: 500,
      message: 'An unknown error has occurred',
      type: 'Unknown error',
    };
  }
}
