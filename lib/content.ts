const currentYear = new Date().getFullYear();

const title = { primary: "Project Title", description: "Project Description" };

const color = { primary: "#81F5FF" };
const image = {};

const page = {
  metadata: (currentPage: string) => `${title.primary} | ${currentPage}`,
  copyright: `Copyright © ${currentYear}. Project Maker.\nAll rights reserved.`,

  auth: {
    title: title.primary,
    subtitle: `Access the ${title.primary} Dashboard securely by entering your credentials.`,
  },

  account: {
    title: "User Management",
    subtitle: "Manage and view details of all registered users.",
  },

  profile: {
    profile: {
      title: "Personal Information",
      subtitle: `Update and manage your ${title.primary} profile details.`,
    },

    password: {
      title: "Change Password",
      subtitle: "Ensure your new password is strong and secure.",
    },

    activeSession: {
      title: "Active Sessions",
      subtitle:
        "Review and manage devices and sessions currently logged into your account.",
    },

    deleteAccount: {
      title: "Delete Account",
      subtitle:
        "Caution: Deleting your account is permanent and cannot be undone.",
    },
  },
};

const dialog = {
  user: {
    create: {
      trigger: "Create User",
      title: "Create New User",
      desc: "Create new user by entering their details. Make sure all required fields are filled correctly.",
    },

    remove: {
      trigger: "Remove",
      title: (username: string) => `Remove ${username}'s Account?`,
      desc: "This will permanently delete the account and all associated data. This action cannot be undone. Please proceed carefully.",
    },
  },

  profile: {
    removeAvatar: {
      trigger: "Remove Avatar",
      title: "Remove Profile Avatar",
      desc: "Are you sure you want to remove your profile avatar?",
    },

    revokeSession: {
      title: "Terminate Session",
      desc: "Are you sure you want to terminate this active session? This will log the device out immediately.",
    },

    revokeAllOtherSession: {
      trigger: "Terminate All Other Session",
      title: "Terminate All Other Session",
      desc: "Are you sure you want to terminate all other active session? This will log all the devices out immediately.",
    },

    deleteAccount: {
      trigger: "Delete Account",
      title: "Confirm Account Deletion",
      desc: "Deleting your account will permanently remove all associated data. This action cannot be undone.",
    },
  },
};

const label = {
  error: {
    protectedPath: "Invalid protected route!",
    breadcrumb: "Invalid menu route!",
    parsedNumber: "Invalid parsed number!",
  },

  toast: {
    loading: { default: "Processing your request. Please wait..." },

    success: {
      user: {
        signIn: (username: string) =>
          `Signed in successfully, Welcome ${username}!`,
        signUp:
          "Your account has been registered successfully! Please sign in to continue.",
        signOut: "Signed out successfully.",
      },

      profile: {
        update: (field: string) =>
          `Your ${field.toLowerCase()} has been updated successfully.`,
        revokeSession: "The session has been terminated successfully.",
        revokeAllOtherSession:
          "All other sessions have been terminated successfully.",
        deleteAccount: "Your account has been deleted successfully. Goodbye!",
      },
    },

    info: {
      profile: "No changes were made to your profile.",
    },

    error: {
      catch: "Something went wrong. Please try again later.",
      file: {
        required: (fileType: string) => `Please upload a valid ${fileType}.`,
        upload: "An error occurred while uploading the file. Please try again.",
      },
    },
  },

  button: {
    signIn: "Sign In",
    signUp: "Create Account",
    signOn: (social: string) => `Continue with ${social}`,
    signOut: "Sign Out",

    datePicker: "Pick a Date",
    fileInput: {
      placeholder: "Drag & drop a file here, or click to upload",
      size: (mb: number) => `Maximum File Size: ${mb} MB`,
      empty: "No file selected",
    },

    save: "Save Changes",
    confirm: "Confirm",
    refresh: "Refresh",
    reset: "Reset",
    cancel: "Cancel",
    back: "Back",
  },
};

export { color, dialog, image, label, page, title };
