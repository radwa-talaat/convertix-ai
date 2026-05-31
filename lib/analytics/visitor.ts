const VISITOR_KEY = "ai-builder-visitor-id";
const SESSION_KEY = "ai-builder-session-id";

export function getOrCreateVisitorId() {
  return getOrCreateId(VISITOR_KEY);
}

export function getOrCreateSessionId() {
  return getOrCreateId(SESSION_KEY, true);
}

function getOrCreateId(key: string, session = false) {
  const storage = session ? window.sessionStorage : window.localStorage;
  const existing = storage.getItem(key);

  if (existing) {
    return existing;
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  storage.setItem(key, id);

  return id;
}
