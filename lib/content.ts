const metadata = {
  title: "Project Title",
  description: "Project Description",
  manifest: "/manifest.json",
  keywords: ["web application", "next starter"],
};

const color = {};
const image = {};

const page = {
  title: (currentPage: string) => `${metadata.title} | ${currentPage}`,

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
      trigger: "Remove User",
      title: (name: string) => `Remove ${name}'s Account`,
      desc: (name: string) =>
        `This will permanently delete ${name}'s account and all associated data. Proceed with caution as this action cannot be undone.`,
    },
  },

  profile: {
    removeAvatar: {
      trigger: "Remove Avatar",
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
      user: {
        signIn: (name: string) => `Signed in successfully, Welcome ${name}!`,
        signUp:
          "Your account has been registered successfully! Please sign in to continue.",
        signOut: "Signed out successfully.",

        create: (name: string) => `${name} created successfully!`,
        changeRole: (name: string, role: string) =>
          `${name}'s role has been successfully updated to ${role}!`,
        revokeSession: (name: string) =>
          `All ${name}'s sessions have been terminated successfully.`,
        remove: (name: string) => `${name} has been successfully removed!`,
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
      noChanges: (thing: string, name: string = "your") =>
        `No changes were made to ${name} ${thing}.`,
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

export { color, dialog, image, label, metadata, page };
