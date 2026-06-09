export function readStorageValue(key: string): unknown {
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export function writeStorageValue(key: string, value: unknown): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageValue(key: string): void {
  window.localStorage.removeItem(key);
}
