import {
  StoredAssistantSession,
  StoredAssistantSessionEnvelope,
} from "../../../types/surveyBuilderAssistant.types";
import { STORAGE_KEY_PREFIX, STORAGE_VERSION } from "../../../utils/constants";

const getStorageKey = (surveyID: string) => `${STORAGE_KEY_PREFIX}:${surveyID}`;

const canUseLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isStoredAssistantSession = (
  value: unknown,
): value is StoredAssistantSession => {
  if (!value || typeof value !== "object") return false;

  const session = value as Partial<StoredAssistantSession>;

  if (!isNonEmptyString(session.threadID)) return false;

  if (
    session.activeJobID !== undefined &&
    !isNonEmptyString(session.activeJobID)
  ) {
    return false;
  }

  return true;
};

const isStoredAssistantSessionEnvelope = (
  value: unknown,
): value is StoredAssistantSessionEnvelope => {
  if (!value || typeof value !== "object") return false;

  const envelope = value as Partial<StoredAssistantSessionEnvelope>;

  return (
    envelope.storageVersion === STORAGE_VERSION &&
    isStoredAssistantSession(envelope.session)
  );
};

export const readAssistantSession = (
  surveyID: string,
): StoredAssistantSession | null => {
  if (!canUseLocalStorage() || !isNonEmptyString(surveyID)) {
    return null;
  }

  const storageKey = getStorageKey(surveyID);

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) return null;

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isStoredAssistantSessionEnvelope(parsedValue)) {
      window.localStorage.removeItem(storageKey);
      return null;
    }

    return parsedValue.session;
  } catch {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Local storage may be unavailable or restricted.
    }

    return null;
  }
};

export const writeAssistantSession = (
  surveyID: string,
  session: StoredAssistantSession,
): void => {
  if (
    !canUseLocalStorage() ||
    !isNonEmptyString(surveyID) ||
    !isStoredAssistantSession(session)
  ) {
    return;
  }

  const envelope: StoredAssistantSessionEnvelope = {
    storageVersion: STORAGE_VERSION,
    session,
  };

  try {
    window.localStorage.setItem(
      getStorageKey(surveyID),
      JSON.stringify(envelope),
    );
  } catch {
    // The assistant can continue without persistence.
  }
};

export const setAssistantActiveJobID = (
  surveyID: string,
  activeJobID: string,
): void => {
  if (!isNonEmptyString(activeJobID)) return;

  const session = readAssistantSession(surveyID);

  if (!session) return;

  writeAssistantSession(surveyID, {
    ...session,
    activeJobID,
  });
};

export const clearAssistantActiveJobID = (surveyID: string): void => {
  const session = readAssistantSession(surveyID);

  if (!session) return;

  writeAssistantSession(surveyID, {
    threadID: session.threadID,
  });
};

export const clearAssistantSession = (surveyID: string): void => {
  if (!canUseLocalStorage() || !isNonEmptyString(surveyID)) {
    return;
  }

  try {
    window.localStorage.removeItem(getStorageKey(surveyID));
  } catch {
    // Local storage may be unavailable or restricted.
  }
};
