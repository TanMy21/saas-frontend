import {
  StoredAssistantSession,
  StoredAssistantSessionEnvelope,
} from "../../../types/surveyBuilderAssistant.types";
import { STORAGE_KEY_PREFIX, STORAGE_VERSION } from "../../../utils/constants";

const getStorageKey = (surveyID: string) => `${STORAGE_KEY_PREFIX}:${surveyID}`;

const ASSISTANT_SURVEY_DELETED_EVENT =
  "survey-builder-assistant:survey-deleted";

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
  if (!isNonEmptyString(surveyID)) {
    return;
  }

  const storageKey = getStorageKey(surveyID);

  if (canUseLocalStorage()) {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Local storage may be unavailable or restricted.
    }
  }

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // Session storage may be unavailable or restricted.
    }
  }
};

export const notifyAssistantSurveyDeleted = (surveyID: string): void => {
  if (typeof window === "undefined" || !isNonEmptyString(surveyID)) return;

  clearAssistantSession(surveyID);
  window.dispatchEvent(
    new CustomEvent(ASSISTANT_SURVEY_DELETED_EVENT, {
      detail: { surveyID },
    }),
  );
};

export const subscribeToAssistantSurveyDeleted = (
  surveyID: string,
  onDeleted: () => void,
) => {
  if (typeof window === "undefined" || !isNonEmptyString(surveyID)) {
    return () => undefined;
  }

  const handleDeleted = (event: Event) => {
    const deletedSurveyID = (event as CustomEvent<{ surveyID?: string }>).detail
      ?.surveyID;

    if (deletedSurveyID === surveyID) onDeleted();
  };

  window.addEventListener(ASSISTANT_SURVEY_DELETED_EVENT, handleDeleted);

  return () => {
    window.removeEventListener(ASSISTANT_SURVEY_DELETED_EVENT, handleDeleted);
  };
};
