import { useEffect, useState } from "react";
import { getStorageValueSafe } from "@/utils/storage";

export function useLocalStorage<Type>(key: string, fallbackValue: Type) {
  const [value, setValue] = useState<Type>(
    getStorageValueSafe(key, fallbackValue, "localStorage"),
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export function useSessionStorage<Type>(key: string, fallbackValue: Type) {
  const [value, setValue] = useState<Type>(
    getStorageValueSafe(key, fallbackValue, "sessionStorage"),
  );

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
