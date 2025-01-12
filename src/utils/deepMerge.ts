export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : DeepPartial<T[P]> | null
    : T[P]
}

function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

export function deepMerge<T>(
  target: T,
  source: DeepPartial<T> | null | undefined,
): T {
  if (!source) return { ...target }

  const output = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (
        sourceValue !== null &&
        sourceValue !== undefined &&
        targetValue &&
        isObject(sourceValue) &&
        isObject(targetValue)
      ) {
        // If both values are objects, recursively merge them
        output[key] = deepMerge(
          targetValue,
          sourceValue as DeepPartial<typeof targetValue>,
        )
      } else if (sourceValue !== undefined) {
        // Otherwise, just replace the value
        output[key] = sourceValue as T[Extract<keyof T, string>]
      }
    }
  }

  return output
}
