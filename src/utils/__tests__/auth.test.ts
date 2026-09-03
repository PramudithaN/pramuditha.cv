import {
  hashPassword,
  getStoredPasswordHash,
  setStoredPasswordHash,
  isSessionActive,
  createSession,
  clearSession,
  verifyPassword,
  DEFAULT_INITIAL_HASH,
} from "../auth";

describe("auth utility", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("hashPassword & verifyPassword", () => {
    it("should correctly compute SHA-256 hash", async () => {
      const hash = await hashPassword("admin");
      expect(hash).toBe(DEFAULT_INITIAL_HASH);
    });

    it("should verify correct default password", async () => {
      const isValid = await verifyPassword("admin");
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const isValid = await verifyPassword("wrong-password");
      expect(isValid).toBe(false);
    });

    it("should verify against custom stored password hash", async () => {
      const customHash = await hashPassword("mySecretPassword123");
      setStoredPasswordHash(customHash);

      expect(getStoredPasswordHash()).toBe(customHash);
      expect(await verifyPassword("mySecretPassword123")).toBe(true);
      expect(await verifyPassword("admin")).toBe(false);
    });
  });

  describe("session management", () => {
    it("should report session inactive when not created", () => {
      expect(isSessionActive()).toBe(false);
    });

    it("should activate session upon createSession()", () => {
      createSession();
      expect(isSessionActive()).toBe(true);
    });

    it("should invalidate session upon clearSession()", () => {
      createSession();
      expect(isSessionActive()).toBe(true);

      clearSession();
      expect(isSessionActive()).toBe(false);
    });

    it("should expire sessions older than 2 hours", () => {
      const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
      sessionStorage.setItem(
        "pramuditha_cv_admin_session",
        JSON.stringify({ authenticated: true, timestamp: threeHoursAgo })
      );

      expect(isSessionActive()).toBe(false);
    });
  });
});
