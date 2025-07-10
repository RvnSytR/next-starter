import { Action } from "../const";
import { formatDate, formatDateDistanceToNow } from "../utils";
import { messages } from "./messages";

const user = {
  success: (thing: string, action: Action) =>
    `Your ${messages.success(thing, action)}`,
  noChanges: (thing: string) => `Your ${messages.noChanges(thing)}`,
  verified: "This user has verified their email.",

  signIn: (name?: string) =>
    `Signed in successfully${name ? ` — welcome ${name}!` : "!"}`,
  signUp: "You're all set! Sign in to continue.",
  signOut: "You've been signed out. See you soon!",

  confirmPassword: "Passwords don't match — please double-check.",
  agreement:
    "You'll need to agree to the Terms of Service and Privacy Policy to continue.",

  notAuthorized: "You do not have permission to perform this action.",
  changeRole: (name: string, role: string) =>
    `${name}'s role is now set to ${role}.`,

  current: (thing: "user" | "session") => `Current ${thing}`,
  lastSeen: (time: Date) => messages.thingAgo("Last seen", time),
  createdAgo: (time: Date) =>
    `${formatDate(time, "PPPp")} - ${formatDateDistanceToNow(time)} ago.`,

  revokeThisSession: "This session has been revoked.",
  revokeOtherSessions: "Your other active sessions have been revoked.",

  revokeUserSession: (name?: string) =>
    `${name ? name + "'s" : "All user"} active sessions have been revoked.`,
  revokeUserSessions: (success: number, length: number) =>
    `${success} out of ${length} user active session${length !== 1 ? "s" : ""} have been revoked.`,

  removeUsers: (success: number, length: number) =>
    messages.success(
      `${success} out of ${length} user${length !== 1 ? "s" : ""}`,
      "removed",
    ),

  // * --- Dialogs

  create: {
    trigger: "Create User",
    title: "Create New User",
    desc: "Create a new user by entering their details. Ensure all required fields are completed.",
  },

  detail: {
    title: (name: string) => `${name}'s Details`,
    desc: (name: string) => `View detailed information for ${name}.`,
  },

  revokeSessions: {
    trigger: "Revoke Sessions",
    title: (name: string) => `Revoke All Active Sessions for ${name}`,
    desc: (name: string) =>
      `This will immediately sign out all active sessions for ${name}. Are you sure you want to proceed?`,
  },

  revokeMultipleSessions: {
    trigger: "Revoke Sessions",
    title: (length: number) => `Revoke Sessions for ${length} Users`,
    desc: (length: number) =>
      `This will immediately sign out all active sessions for ${length} selected users. Are you sure you want to proceed?`,
  },

  remove: {
    title: (name: string) => `Remove ${name}'s Account`,
    desc: (name: string) =>
      `This will permanently delete ${name}'s account and all associated data. Proceed with caution as this action cannot be undone.`,
  },

  removeMultiple: {
    title: (length: number) => `Remove ${length} Accounts`,
    desc: (length: number) =>
      `This will permanently delete ${length} selected user accounts and all associated data. Proceed with caution as this action cannot be undone.`,
  },
};

export const profile = {
  removeAvatar: {
    title: "Remove Profile Avatar",
    desc: "This will remove your current profile avatar. Are you sure you want to proceed?",
  },

  revokeSession: {
    trigger: "Revoke Session",
    title: "Revoke Active Session",
    desc: "This will immediately sign out the selected device. Are you sure you want to proceed?",
  },

  revokeAllOtherSession: {
    trigger: "Revoke Other Sessions",
    title: "Revoke All Other Sessions",
    desc: "This will sign out all active sessions except the current one. Are you sure you want to proceed?",
  },

  deleteAccount: {
    trigger: "Delete Account",
    title: "Delete Your Account",
    desc: "Deleting your account will permanently remove all associated data. Proceed with caution as this action cannot be undone.",
  },
};

export const content = { user, profile };
