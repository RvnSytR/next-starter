const currentYear = new Date().getFullYear();

const title = { primary: "Project Title", description: "Project Description" };
const keyword = ["web application", "next starter"];

const color = { primary: "#81F5FF" };
const image = {};

const page = {
  metadata: (currentPage: string) => `${title.primary} | ${currentPage}`,
  copyright: `Copyright © ${currentYear}. Project Maker. All rights reserved.`,

  login: {
    title: `${title.primary}`,
    subtitle: `Please enter your credentials to securely access ${title.primary} Dashboard.`,
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
      title: "Create New User",
      desc: "Create new user by entering their details. Make sure all required fields are filled correctly.",
    },

    approve: {
      title: (username: string) =>
        `Are you sure you want to approve ${username}'s registration?`,
      desc: "Approving this registration is a permanent action and cannot be undone. Once approved, this user will gain dashboard access. Ensure you have reviewed all necessary details before proceeding.",
    },

    delete: {
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
      login: "Signed in successfully!",
      logout: "Signed out successfully!",

      user: {
        create: "User added successfully!",

        approve: (name: string, role: string) =>
          `${name} has been successfully approved as ${role.toWellFormed()}.`,

        update: {
          profile: "Profile updated successfully! Please sign in again.",
          password: "Password updated successfully! Please sign in again.",
        },

        delete: (name: string) => `${name} has been successfully deleted!`,
      },
    },

    error: {
      file: {
        required: (name: string) => `Please upload ${name}!`,
        upload: "An error occurred while uploading the file!",
      },

      login: {
        notFound: "This account is not registered!",
        emailOrPassword: "Incorrect email or password!",
        pending:
          "Your account is still in the approval queue. Please wait for admin confirmation.",
      },

      user: { email: "This email is already registered!" },
    },
  },

  button: {
    login: `Sign in to ${title.primary}`,
    logout: "Sign out",
    refresh: "Refresh",

    save: "Save",
    confirm: "Confirm",
    reset: "Reset",
    back: "Back",
  },
};

export { color, dialog, image, keyword, label, page, title };
