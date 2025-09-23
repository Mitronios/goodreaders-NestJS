/**
 * Safely converts an ID to string, handling both ObjectId and string types
 */
export function convertIdToString(id: unknown, fallbackId?: string): string {
  if (!id) {
    return fallbackId ?? '';
  }

  if (typeof id === 'string') {
    return id;
  }

  // Handle ObjectId or any object with toString method
  if (typeof id === 'object' && id !== null && 'toString' in id) {
    return (id as { toString(): string }).toString();
  }

  return fallbackId ?? '';
}
