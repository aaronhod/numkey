import { useEffect, useState } from "react";

function getStorageValue<Type>(key: string, fallbackValue: Type) {
    if(typeof window === "undefined") {
        return fallbackValue;
    }
    const stored = localStorage.getItem(key);
    const retrievedValue = stored ? JSON.parse(stored) as Type : fallbackValue;
    return retrievedValue;
}

export function useLocalStorage<Type>(key: string, fallbackValue: Type) {
    const [value, setValue] = useState<Type>(getStorageValue(key, fallbackValue));

    useEffect(() => {
        console.info("setting storage", value)
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}