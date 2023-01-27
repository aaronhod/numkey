import { useEffect, useState } from "react";
type StorageType = "localStorage" | "sessionStorage";

function getStorageValue<Type>(
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
  const retrievedValue = storedValue ? (JSON.parse(storedValue) as Type) : fallbackValue;
  return retrievedValue;
}

export function useLocalStorage<Type>(key: string, fallbackValue: Type) {
  const [value, setValue] = useState<Type>(
    getStorageValue(key, fallbackValue, "localStorage")
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export function useSessionStorage<Type>(key: string, fallbackValue: Type) {
  const [value, setValue] = useState<Type>(
    getStorageValue(key, fallbackValue, "sessionStorage")
  );

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
