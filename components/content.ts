const currentYear = new Date().getFullYear();

const color = { primary: "#81F5FF" };

const image = {};

const title = { primary: "Project Title", description: "Project Description" };

const page = {
  metadata: (currentPage: string) => `${title.primary} | ${currentPage}`,
  copyright: `Copyright © ${currentYear}. Project Maker. All rights reserved.`,

  login: {
    title: `${title.primary} Admin`,
    subtitle: `Please enter your Admin account email and password below to access the ${title.primary} Dashboard.`,
  },

  settings: {
    profile: {
      title: "Change Profile",
      subtitle:
        "After making changes to your profile, the system will ask you to log in again. Make sure the information is correct before continuing.",
    },

    password: {
      title: "Change Password",
      subtitle:
        "After changing your password, the system will ask you to log in again. Make sure the information is correct before continuing.",
    },
  },
};

const label = {
  error: {
    protectedPath: "Protected Path Invalid!",
    breadcrumb: "Menu Path Invalid!",
    parsedNumber: "Parsed Number Invalid!",
  },

  toast: {
    loading: { default: "Please Wait a Moment..." },

    success: {
      login: "Sign In Successfully!",
      logout: "Sign Out Successfully!",

      user: {
        create: "User successfully added!",

        approve: (name: string, role: string) =>
          `${name} successfully approved as ${role.toWellFormed()}.`,

        update: {
          profile: "Profile Updated Successfully! Please Sign In Again",
          password: "Password Updated Successfully! Please Sign In Again",
        },

        delete: (name: string) => `${name} successfully deleted!`,
      },
    },

    error: {
      file: {
        required: (name: string) => `Please upload ${name}!`,
        upload: "An error occurred while uploading the file!",
      },

      login: {
        notFound: "Account is not registered!",
        emailOrPassword: "Wrong Email or Password!",
        pending:
          "Your account is still in the approval queue. Please wait for confirmation from the admin.",
      },

      user: { email: "Email is registered!" },
    },
  },

  button: {
    login: `Sign In to ${title.primary} Admin`,
    logout: "Sign Out",
    refresh: "Refresh",

    save: "Save",
    confirm: "Confirm",
    reset: "Reset",
    back: "Back",
  },
};

export { color, image, label, page, title };
