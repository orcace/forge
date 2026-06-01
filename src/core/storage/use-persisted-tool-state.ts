import { useEffect, useState } from "react";
import { storageKeys } from "./storage.keys";
import { readStorageValue, writeStorageValue } from "./storage.service";

export function usePersistedToolState<TValue>(
  toolId: string,
  initialValue: TValue,
): [TValue, (value: TValue) => void] {
  const [value, setValue] = useState<TValue>(() => {
    const storedValue = readStorageValue(storageKeys.toolState(toolId));
    return storedValue === null ? initialValue : (storedValue as TValue);
  });

  useEffect(() => {
    writeStorageValue(storageKeys.toolState(toolId), value);
  }, [toolId, value]);

  return [value, setValue];
}
