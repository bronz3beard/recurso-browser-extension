export function assertIsTrue(
  condition: boolean,
  errorMessage?: string,
): asserts condition {
  if (!condition) {
    throw new Error(errorMessage ?? 'Assertion has failed')
  }
}

export function isFunction<T>(func: T): boolean {
  return func != null && typeof func === 'function'
}