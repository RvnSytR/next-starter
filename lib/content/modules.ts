import { formatDate, formatDateDistanceToNow } from "../utils";
import { messages } from "./messages";

const auth = {
  verified: "This user has verified their email.",
  current: (thing: "user" | "session") => `Current ${thing}`,
  lastSeen: (time: Date) => messages.thingAgo("Last seen", time),
  createdAgo: (time: Date) =>
    `${formatDate(time, "PPPp")} - ${formatDateDistanceToNow(time)} ago.`,

  signIn: (name?: string) =>
    `Signed in successfully${name ? ` — welcome ${name}!` : "!"}`,
  signUp: "You're all set! Sign in to continue.",
  signOut: "You've been signed out. See you soon!",
  changeRole: (name: string, role: string) =>
    `${name}'s role is now set to ${role}.`,

  confirmPassword: "Passwords don't match — please double-check.",
  updatePassword: messages.success("password", "updated"),

  agreement:
    "You'll need to agree to the Terms of Service and Privacy Policy to continue.",
  notAuthorized: "You do not have permission to perform this action.",

  detail: {
    title: (name: string) => `${name}'s Details`,
    desc: (name: string) => `View detailed information for ${name}.`,
  },

  fields: {
    userId: "User ID",
    avatar: "Avatar",
    rememberMe: "Remember me",
    profilePic: "Profile Picture",
    role: "Role",
    changeRole: (name: string) => `Change ${name}'s Role`,

    email: { label: "Email address", placeholder: "Enter your email address" },
    name: { label: "Name", placeholder: "Enter your name" },

    password: { label: "Password", placeholder: "Enter your password" },
    currentPassword: {
      label: "Current Password",
      placeholder: "Enter your current password",
    },
    newPassword: {
      label: "New Password",
      placeholder: "Enter your new password",
    },
    confirmPassword: {
      label: "Confirm Password",
      placeholder: "Confirm your password",
    },

    agreement: {
      label: "Accept terms and conditions",
      placeholder: "I agree to the terms of service and privacy policy.",
    },
  },

  components: {
    profilePic: {
      title: "Remove Profile Picture",
      desc: "This will remove your current profile picture. Are you sure you want to proceed?",
      success: (isUpdate?: boolean) =>
        messages.success(
          "Your profile picture",
          isUpdate ? "updated" : "removed",
        ),
    },

    personalInfo: {
      noChanges: messages.noChanges("profile"),
      success: messages.success("profile", "updated"),
    },

    revokeSession: {
      trigger: "Revoke Session",
      title: "Revoke Active Session",
      desc: "This will immediately sign out the selected device. Are you sure you want to proceed?",
      success: "This session has been revoked.",
    },

    revokeAllOtherSession: {
      trigger: "Revoke Other Sessions",
      title: "Revoke All Other Sessions",
      desc: "This will sign out all active sessions except the current one. Are you sure you want to proceed?",
      success: "Your other active sessions have been revoked.",
    },

    delete: {
      trigger: "Delete Account",
      title: "Delete Your Account",
      desc: "Deleting your account will permanently remove all associated data. Proceed with caution as this action cannot be undone.",
      success: messages.success("account", "removed"),
    },

    adminCreate: {
      trigger: "Create User",
      title: "Create New User",
      desc: "Create a new user by entering their details. Ensure all required fields are completed.",
      success: (name: string) => messages.success(`${name} account`, "created"),
    },

    adminRevokeSessions: {
      trigger: "Revoke Sessions",

      title: (name: string) => `Revoke All Active Sessions for ${name}`,
      desc: (name: string) =>
        `This will immediately sign out all active sessions for ${name}. Are you sure you want to proceed?`,
      success: (name?: string) =>
        `${name ? name + "'s" : "All user"} active sessions have been revoked.`,

      titleMultiple: (length: number) => `Revoke Sessions for ${length} Users`,
      descMultiple: (length: number) =>
        `This will immediately sign out all active sessions for ${length} selected users. Are you sure you want to proceed?`,
      successMultiple: (success: number, length: number) =>
        `${success} out of ${length} user active session${length !== 1 ? "s" : ""} have been revoked.`,
    },

    adminRemove: {
      title: (name: string) => `Remove ${name}'s Account`,
      desc: (name: string) =>
        `This will permanently delete ${name}'s account and all associated data. Proceed with caution as this action cannot be undone.`,

      titleMultiple: (length: number) => `Remove ${length} Accounts`,
      descMultiple: (length: number) =>
        `This will permanently delete ${length} selected user accounts and all associated data. Proceed with caution as this action cannot be undone.`,
      successMultiple: (success: number, length: number) =>
        messages.success(
          `${success} out of ${length} user${length !== 1 ? "s" : ""}`,
          "removed",
        ),
    },
  },
};

export const baseContent = { auth };
