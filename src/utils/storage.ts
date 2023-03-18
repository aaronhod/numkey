export type StorageType = "localStorage" | "sessionStorage";

/**
 * get storage value or fallback value
 *
 * @returns storage value or fallback value
 */
export function getStorageValueSafe<Type>(
  key: string,
  fallbackValue: Type,
  storageType: StorageType
) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  if (!key) {
    throw new Error("Key is required");
  }

  const storedValue = window[storageType].getItem(key);
  const retrievedValue = storedValue
    ? (JSON.parse(storedValue) as Type)
    : fallbackValue;
  return retrievedValue;
}

/**
 * get storage value without fallback value
 *
 * @returns found value or undefined
 */
export function getStorageValueUnsafe<Type>(
  key: string,
  storageType: StorageType
) {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (!key) {
    throw new Error("Key is required");
  }

  const storedValue = window[storageType].getItem(key);
  const retrievedValue = storedValue
    ? (JSON.parse(storedValue) as Type)
    : undefined;
  return retrievedValue;
}

export function saveToStorage(key: string, item: object, storageType: StorageType) {
    if (typeof window === "undefined") {
        console.error("attempt to save to storage was made but window is undefined");
        return;
    }

    window[storageType].setItem(key, JSON.stringify(item));
}