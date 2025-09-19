import { CreditCard, Shield, User } from "lucide-react";

import { NotificationSettings, TabId } from "./types";

export const LAST_WS_KEY = "lWSID";

export const VIEW_MODE_KEY = "ws:vm";

export const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "general", label: "General", icon: User },
  { id: "security", label: "Security", icon: Shield },
  // { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Subscription", icon: CreditCard },
];

export const LABELS: Record<
  keyof NotificationSettings,
  { title: string; desc: string }
> = {
  emailNotifications: {
    title: "Email Notifications",
    desc: "Receive notifications via email",
  },
  pushNotifications: {
    title: "Push Notifications",
    desc: "Receive push notifications in your browser",
  },
  marketingEmails: {
    title: "Marketing Emails",
    desc: "Receive promotional emails and updates",
  },
  securityAlerts: {
    title: "Security Alerts",
    desc: "Important security notifications",
  },
};
