import * as SecureStore from "expo-secure-store";

const PREFIX = "auto-meds";
const INDEX_KEY = `${PREFIX}:index`;

async function trackKey(fullKey: string) {
  const current = await SecureStore.getItemAsync(INDEX_KEY);
  const parsed: string[] = current ? JSON.parse(current) : [];
  if (!parsed.includes(fullKey)) {
    parsed.push(fullKey);
    await SecureStore.setItemAsync(INDEX_KEY, JSON.stringify(parsed));
  }
}

export async function saveObject(key: string, value: unknown) {
  const fullKey = `${PREFIX}:${key}`;
  await SecureStore.setItemAsync(fullKey, JSON.stringify(value ?? {}));
  await trackKey(fullKey);
}

export async function getObject<T>(key: string): Promise<T | undefined> {
  const raw = await SecureStore.getItemAsync(`${PREFIX}:${key}`);
  return raw ? (JSON.parse(raw) as T) : undefined;
}

export async function deleteKey(key: string) {
  const fullKey = `${PREFIX}:${key}`;
  await SecureStore.deleteItemAsync(fullKey);
}

export async function eraseAllKeys() {
  const keys = await SecureStore.getItemAsync(INDEX_KEY);
  if (!keys) {
    return;
  }
  const parsed: string[] = JSON.parse(keys);
  await Promise.all(parsed.map((key) => SecureStore.deleteItemAsync(key)));
  await SecureStore.deleteItemAsync(INDEX_KEY);
}
