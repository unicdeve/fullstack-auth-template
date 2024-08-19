class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

/**
 * @description Asserts that the given condition is true. Throws an error if the condition is false.
 * @param condition The condition to check.
 * @param message Optional message to include in the error if the assertion fails.
 */
export function assertDefined(
  condition: unknown,
  message?: string,
): asserts condition {
  if (condition) {
    return;
  }

  const errorMessage = message ? message : 'Assertion failed';

  throw new AssertionError(errorMessage);
}
