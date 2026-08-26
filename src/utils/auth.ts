// Cryptographic SHA-256 Hashing and Authentication Utility

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const PASSWORD_HASH_KEY = "pramuditha_cv_admin_pwd_hash";
const SESSION_KEY = "pramuditha_cv_admin_session";

// Default initial password: "admin" if none has been configured
export const DEFAULT_INITIAL_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // SHA-256 for "admin"

export function getStoredPasswordHash(): string {
  return localStorage.getItem(PASSWORD_HASH_KEY) || DEFAULT_INITIAL_HASH;
}

export function setStoredPasswordHash(newHash: string): void {
  localStorage.setItem(PASSWORD_HASH_KEY, newHash);
}

export function isSessionActive(): boolean {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) return false;
  try {
    const data = JSON.parse(session);
    // Session expires after 2 hours
    if (Date.now() - data.timestamp > 2 * 60 * 60 * 1000) {
      clearSession();
      return false;
    }
    return true;
  } catch {
    clearSession();
    return false;
  }
}

export function createSession(): void {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ authenticated: true, timestamp: Date.now() })
  );
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("is_cv_admin_authorized");
}

export async function verifyPassword(inputPassword: string): Promise<boolean> {
  const inputHash = await hashPassword(inputPassword);
  const storedHash = getStoredPasswordHash();
  return inputHash === storedHash;
}
