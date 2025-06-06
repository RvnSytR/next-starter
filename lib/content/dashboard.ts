import { appInfo } from "../const";

export const dashboardPage = {
  auth: {
    title: appInfo.name,
    desc: `Access the ${appInfo.name} Dashboard securely by entering your credentials.`,
  },

  account: {
    title: "User Management",
    desc: "Manage and view details of all registered users.",
  },

  profile: {
    info: {
      title: "Personal Information",
      desc: `Update and manage your ${appInfo.name} profile details.`,
    },

    password: {
      title: "Change Password",
      desc: "Ensure your new password is strong and secure.",
    },

    activeSession: {
      title: "Active Sessions",
      desc: "Review and manage devices and sessions currently logged into your account.",
    },

    deleteAccount: {
      title: "Delete Account",
      desc: "Caution: Deleting your account is permanent and cannot be undone.",
    },
  },
};
