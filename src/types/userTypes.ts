export type Role = "OWNER" | "ADMIN" | "EDITOR" | "ANALYST" | "VIEWER";

export interface OrganizationSummary {
  orgID: string;
  organizationName: string;
  orgSlug: string;
  tier: "FREE" | "PROFESSIONAL" | "ENTERPRISE";
}

export interface OrganizationMembership {
  relatedOrgID: string;
  role: Role;
  organization: OrganizationSummary;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
  tier: "FREE" | "PROFESSIONAL" | "ENTERPRISE";
  /**
   * ⚠️ Deprecated (you should phase this out)
   */
  isAdmin: boolean;
  tours: {
    hasCompletedDashboardTour: boolean;
    hasSkippedDashboardTour: boolean;
    hasCompletedBuilderTour: boolean;
    hasSkippedBuilderTour: boolean;
  };
  organizationMembers: OrganizationMembership[];
}

export type AccountSettings = {
  user: User;
};

export type CreateOrgUserFormData = {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  orgID: string;
};
