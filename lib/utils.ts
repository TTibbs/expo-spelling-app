/**
 * Generates a unique ID using a combination of timestamp and random numbers
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}
