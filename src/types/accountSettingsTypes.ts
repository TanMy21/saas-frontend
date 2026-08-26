export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserSession {
  sessionID: string;
  state: string;
  user: {
    userID: string;
    email: string;
    name: string;
    role: string;
    verified: boolean;
    deletedAt: string | null;
  };
  network: {
    ipAddress: string | null;
    country: string | null;
    city: string | null;
  };
  device: {
    userAgent: string | null;
    deviceType: string | null;
    browser: string | null;
    os: string | null;
  };
  createdAt: string;
  lastActiveAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
}

export interface AuditLog {
  auditID: string;
  actor: {
    userID: string | null;
    email: string;
    role: string | null;
  };
  entity: {
    type: string;
    action: string;
    id: string | null;
  };
  context: {
    workspaceID: string | null;
    surveyID: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    requestID: string | null;
  };
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface SessionFilters {
  page?: number;
  limit?: number;
  search?: string;
  userID?: string;
  email?: string;
  state?: string;
  country?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
}

export interface AuditFilters {
  page?: number;
  limit?: number;
  search?: string;
  actorUserID?: string;
  actorEmail?: string;
  relatedWorkspaceID?: string;
  relatedSurveyID?: string;
  entityType?: string;
  actionType?: string;
  entityID?: string;
}

export type ActivityView = "sessions" | "audit-logs";