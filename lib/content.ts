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

  settings: {
    profile: {
      title: "Change Profile",
      subtitle:
        "To apply profile changes, you'll need to sign in again. Please review your updates carefully before proceeding.",
    },

    password: {
      title: "Change Password",
      subtitle:
        "For security reasons, you'll be required to log in again after updating your password. Ensure your new password is accurate before confirming.",
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

    delete: {
      trigger: "Delete",
      title: (username: string) =>
        `Are you sure, you want to delete ${username}?`,
      desc: "Deleting this account is a permanent action and cannot be undone. Ensure you have reviewed all necessary details before proceeding.",
    },
  },
};

const label = {
  error: {
    protectedPath: "Protected path invalid!",
    breadcrumb: "Menu path invalid!",
    parsedNumber: "Parsed number invalid!",
  },

  toast: {
    loading: { default: "Please wait a moment..." },

    success: {
      signIn: (username: string) =>
        `Signed in successfully, Welcome ${username}!`,
      signUp: (username: string) =>
        `Your account has been registered successfully, Welcome ${username}!`,
      signOut: "Signed out successfully!",
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
    refresh: "Refresh",

    datePicker: "Pick a date",
    fileInput: {
      placeholder: "Drag & drop your file here, or Click to upload",
      size: (mb: number) => `Max File Size: ${mb} MB`,
      empty: "No file selected",
    },

    save: "Save",
    confirm: "Confirm",
    reset: "Reset",
    back: "Back",
  },
};

export { color, dialog, image, label, page, title };
