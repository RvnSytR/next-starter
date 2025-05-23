const metadata = {
  title: "Project Title",
  description: "Project Description",
  manifest: "/manifest.json",
  keywords: ["web application", "next starter"],
};

const image = {};

const page = {
  title: (currentPage: string) => `${currentPage} | ${metadata.title}`,

  auth: {
    title: metadata.title,
    subtitle: `Access the ${metadata.title} Dashboard securely by entering your credentials.`,
  },

  account: {
    title: "User Management",
    subtitle: "Manage and view details of all registered users.",
  },

  profile: {
    profile: {
      title: "Personal Information",
      subtitle: `Update and manage your ${metadata.title} profile details.`,
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
      desc: "Create a new user by entering their details. Ensure all required fields are completed.",
    },

    changeRole: {
      trigger: "Change Role",
      title: (name: string) => `Change ${name}'s Role`,
      desc: (name: string) =>
        `Changing ${name}'s role will update their permissions and access within the system. Are you sure you want to proceed?`,
    },

    revokeSession: {
      trigger: "Terminate Sessions",
      title: (name: string) => `Terminate All Active Sessions for ${name}`,
      desc: (name: string) =>
        `This will immediately sign out all active sessions for ${name}. Are you sure you want to proceed?`,
    },

    remove: {
      title: (name: string) => `Remove ${name}'s Account`,
      desc: (name: string) =>
        `This will permanently delete ${name}'s account and all associated data. Proceed with caution as this action cannot be undone.`,
    },
  },

  profile: {
    removeAvatar: {
      title: "Remove Profile Avatar",
      desc: "This will remove your current profile avatar. Are you sure you want to proceed?",
    },

    revokeSession: {
      trigger: "Terminate Session",
      title: "Terminate Active Session",
      desc: "This will immediately sign out the selected device. Are you sure you want to proceed?",
    },

    revokeAllOtherSession: {
      trigger: "Terminate Other Sessions",
      title: "Terminate All Other Sessions",
      desc: "This will sign out all active sessions except the current one. Are you sure you want to proceed?",
    },

    deleteAccount: {
      trigger: "Delete Account",
      title: "Delete Your Account",
      desc: "Deleting your account will permanently remove all associated data. This action cannot be undone. Proceed with caution.",
    },
  },
};

const label = {
  error: {
    default: "Uh-oh, Something went wrong. Please try again later.",
    tooManyRequest: "Too many requests. Please try again later.",

    protectedPath: "Invalid protected route!",
    breadcrumb: "Invalid menu route!",
    parsedNumber: "Invalid parsed number!",
  },

  toast: {
    loading: { default: "Processing your request..." },

    success: {
      default: (
        thing: string,
        action: "created" | "updated" | "removed" | "terminated",
        target: string = "Your",
      ) => `${target} ${thing} has been ${action} successfully.`,

      user: {
        signIn: (name: string) => `Signed in successfully, Welcome ${name}!`,
        signUp:
          "Your account has been registered successfully! Please sign in to continue.",
        signOut: "Signed out successfully.",
        changeRole: (name: string, role: string) =>
          `${name}'s role has been successfully updated to ${role}!`,
        revokeSession: (name: string) =>
          `All ${name}'s sessions have been terminated successfully.`,
      },
    },

    info: {
      noChanges: (thing: string, target: string = "your") =>
        `No changes were made to ${target} ${thing}.`,
    },

    error: {
      catch: "Uh-oh, Something went wrong. Please try again later.",
      file: {
        required: (fileType: string) => `Please upload a valid ${fileType}.`,
        upload: "An error occurred while uploading the file. Please try again.",
      },
    },
  },

  button: {
    signOn: (social: string) => `Continue with ${social}`,
    signIn: {
      text: "Sign In",
      loading: "Signing in...",
    },
    signUp: {
      text: "Create Account",
      loading: "Creating account...",
    },
    signOut: {
      text: "Sign Out",
      loading: "Signing out...",
    },

    datePicker: "Pick a Date",
    fileInput: {
      placeholder: "Drag & drop a file here, or click to upload",
      size: (mb: number) => `Up to ${mb} MB`,
    },

    save: {
      text: "Save Changes",
      loading: "Saving changes...",
    },
    refresh: {
      text: "Refresh",
      loading: "Refreshing...",
    },
    upload: {
      text: (file: string = "") => `Upload ${file}`,
      loading: "Uploading...",
    },
    remove: {
      text: "Remove",
      loading: "Removing...",
    },

    confirm: "Confirm",
    reset: "Reset",
    cancel: "Cancel",
    back: "Back",
  },
};

export { dialog, image, label, metadata, page };
