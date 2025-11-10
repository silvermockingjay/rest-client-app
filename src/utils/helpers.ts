export function removeDynamicKey<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K
): Omit<T, K> {
  const updatedObj = Object.fromEntries(
    Object.entries(obj).filter(([objKey]) => objKey !== key)
  ) as Omit<T, K>;
  return updatedObj;
}
