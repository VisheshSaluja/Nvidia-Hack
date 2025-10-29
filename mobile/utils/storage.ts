const memoryStore = new Map<string, string>();

export async function saveObject(key: string, value: unknown) {
  memoryStore.set(key, JSON.stringify(value ?? {}));
}

export async function getObject<T>(key: string): Promise<T | undefined> {
  const raw = memoryStore.get(key);
  return raw ? (JSON.parse(raw) as T) : undefined;
}

export async function deleteKey(key: string) {
  memoryStore.delete(key);
}

export async function eraseAllKeys() {
  memoryStore.clear();
}
