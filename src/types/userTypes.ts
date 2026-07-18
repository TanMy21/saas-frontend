export type Role = "OWNER" | "ADMIN" | "EDITOR" | "ANALYST" | "VIEWER";

export type Tier = "FREE" | "PROFESSIONAL" | "ENTERPRISE";

export interface OrganizationSummary {
  orgID: string;
  organizationName: string;
  orgSlug: string;
  tier: Tier;
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
  // Deprecated (you should phase this out)
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

export interface OrgMember {
  membershipID: string;
  relatedOrgID: string;
  userID: string;
  role: string;
  user: {
    id: string;
    firstname: string;
    lastname?: string;
    email: string;
    verified: boolean;
  };
}

export interface RegistrationRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  organization: string;
}

export interface RegistrationResponse {
  id: string;
  email: string;
  verified: false;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  id: string;
  email: string;
  verified: true;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}
