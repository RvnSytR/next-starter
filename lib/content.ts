import { Capitalize } from "./utils";

const currentYear = new Date().getFullYear();

const title = { primary: "Project Title", description: "Project Description" };
const keyword = ["web application", "next starter"];

const color = { primary: "#81F5FF" };
const image = {};

const page = {
  metadata: (currentPage: string) => `${title.primary} | ${currentPage}`,
  copyright: `Copyright © ${currentYear}. Project Maker. All rights reserved.`,

  signIn: {
    title: `${title.primary}`,
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
      signOut: "Signed out successfully!",

      user: {
        create: "User created successfully!",

        approve: (name: string, role: string) =>
          `${name} has been successfully approved as ${Capitalize(role)}.`,

        update: {
          profile: "Profile updated successfully, Please sign in again!",
          password: "Password updated successfully, Please sign in again!",
        },

        delete: (name: string) => `${name} has been successfully deleted!`,
      },
    },

    error: {
      catch: "Uh-oh! Something went wrong. Please try again later.",

      file: {
        required: (name: string) => `Please upload ${name}!`,
        upload: "An error occurred while uploading the file!",
      },

      signIn: {
        notFound: "This account is not registered!",
        emailOrPassword: "Incorrect email or password!",
        pending:
          "Your account is still in the approval queue. Please wait for admin confirmation.",
      },

      user: {
        notFound: "User not found!",
        email: "This email is already registered!",
        password: "Incorrect password!",
        samePassword:
          "The new password cannot be the same as the current password!",
      },
    },
  },

  button: {
    signIn: `Sign in to ${title.primary}`,
    signOut: "Sign out",
    refresh: "Refresh",

    datePicker: "Pick a date",
    fileInput: {
      placeholder: "Drag & drop your file here, or Click to upload",
      empty: "No file selected",
    },

    save: "Save",
    confirm: "Confirm",
    reset: "Reset",
    back: "Back",
  },
};

export { color, dialog, image, keyword, label, page, title };
