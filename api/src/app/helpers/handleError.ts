/**
 * Handles an error and transforms it into a standardized format with an appropriate HTTP status code.
 *
 * This function takes an error object and maps it to a consistent structure with a status code.
 * It is designed to handle different types of errors and provide a meaningful HTTP status code.
 *
 * @param {unknown} error - The error object to be handled.
 *
 * @returns {object} Returns an object with standardized error information, including:
 *   - status: HTTP status code.
 *   - type: Type of error.
 *   - message: Error message.
 */
export function handleError(error: unknown) {
  const baseError = {
    type: (error as { type?: string }).type,
    message: (error as { message?: string }).message,
  }

  switch (baseError.type) {
    case 'RequiredResourceError':
      return { ...baseError, status: 400 }
    case 'TypeError':
      return { ...baseError, status: 400 }
    case 'DuplicatedResourceError':
      return { ...baseError, status: 409 }
    case 'NotFoundError':
      return { ...baseError, status: 404 }
    default:
      return {
        status: 500,
        message: 'An unknown error has occurred',
        type: 'Unknown error',
      }
  }
}
