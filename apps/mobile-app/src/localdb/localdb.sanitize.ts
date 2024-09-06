export function sanitizeStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string') ? value : [];
}

export function sanitizeNumberArray(value: unknown): number[] {
  return Array.isArray(value) && value.every(item => typeof item === 'number') ? value : [];
}

export function rawInput(value: string) {
  return value;
}
