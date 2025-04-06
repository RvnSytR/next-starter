const currentYear = new Date().getFullYear();

const title = { primary: "Project Title", description: "Project Description" };

const color = { primary: "#81F5FF" };
const image = {};

const page = {
  metadata: (currentPage: string) => `${title.primary} | ${currentPage}`,
  copyright: `Copyright © ${currentYear}. Project Maker.\nAll rights reserved.`,

  auth: {
    title: title.primary,
    subtitle: `Please enter your credentials to securely access ${title.primary} Dashboard.`,
  },

  account: {
    title: "Users Overview",
    subtitle:
      "A comprehensive overview of all registered users, providing their essential details and management actions.",
  },

  profile: {
    profile: {
      title: "Personal Information",
      subtitle: `Manage your ${title.primary} profile.`,
    },

    password: {
      title: "Change Password",
      subtitle: "Make sure your new password is strong and secure.",
    },

    activeSession: {
      title: "Active Sessions",
      subtitle: "Manage your logged in devices and sessions in your account.",
    },

    deleteAccount: {
      title: "Delete Account",
      subtitle:
        "Warning: Deleting your account is permanent and cannot be undone.",
    },
  },
};

const dialog = {
  user: {
    create: {
      trigger: "Create New User",
      title: "Create New User",
      desc: "Create new user by entering their details. Make sure all required fields are filled correctly.",
    },

    approve: {
      trigger: "Approve",
      title: (username: string) =>
        `Are you sure you want to approve ${username}'s registration?`,
      desc: "Approving this registration is a permanent action and cannot be undone. Once approved, this user will gain dashboard access. Ensure you have reviewed all necessary details before proceeding.",
    },

    remove: {
      trigger: "Remove",
      title: (username: string) =>
        `Are you sure you want to remove ${username}?`,
      desc: "This will permanently remove the account and all associated data. This action cannot be undone. Please proceed carefully.",
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
      trigger: "Delete My Account",
      title: "Are you sure you want to delete your account?",
      desc: "Deleting your account will permanently remove all your associated data. This action cannot be undone. Are you sure you want to continue?",
    },
  },
};

const label = {
  error: {
    protectedPath: "Protected route invalid!",
    breadcrumb: "Menu route invalid!",
    parsedNumber: "Parsed number invalid!",
  },

  toast: {
    loading: { default: "Please wait a moment..." },

    success: {
      user: {
        signIn: (username: string) =>
          `Signed in successfully, Welcome ${username}!`,
        signUp:
          "Your account has been registered successfully! Please sign in to access your account.",
        signOut: "Signed out successfully!",
      },

      profile: {
        update: (u: string) =>
          `Your ${u.toLocaleLowerCase()} has been successfully updated!`,
        revokeSession: "The session has been successfully terminated!",
        revokeAllOtherSession:
          "All other sessions has been successfully terminated!",
        deleteAccount: "Your account has been successfully deleted. Goodbye!",
      },
    },

    info: {
      profile: "No changes were made to your username.",
    },

    error: {
      catch: "Uh-oh! Something went wrong. Please try again later.",
      file: {
        required: (f: string) => `Please upload ${f}!`,
        upload: "An error occurred while uploading the file!",
      },
    },
  },

  button: {
    signIn: "Sign In",
    signUp: "Create Account",
    signOn: (social: string) => `Continue with ${social}`,
    signOut: "Sign out",

    datePicker: "Pick a date",
    fileInput: {
      placeholder: "Drag & drop your file here, or Click to upload",
      size: (mb: number) => `Max File Size: ${mb} MB`,
      empty: "No file selected",
    },

    save: "Save",
    confirm: "Confirm",
    update: "Update",
    refresh: "Refresh",
    reset: "Reset",
    cancel: "Cancel",
    back: "Back",
  },
};

export { color, dialog, image, label, page, title };
