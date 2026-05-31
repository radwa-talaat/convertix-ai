export function sanitizePlainText(input: string, maxLength = 5000) {
  return input
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeObject<TValue>(value: TValue): TValue {
  if (typeof value === "string") {
    return sanitizePlainText(value) as TValue;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeObject(item)) as TValue;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeObject(item)]),
    ) as TValue;
  }

  return value;
}
