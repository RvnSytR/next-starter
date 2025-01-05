// const path = {
//   login: "/login",
//   protected: "/dashboard",
//   createAccount: "/dashboard/account",
// };

// const label = {
//   metadata: (currentPage: string) => `Project Title | ${currentPage}`,
//   copyright: `Copyright © ${currentYear}. Copyright Title. All rights reserved.`,
//   page: {
//     login: {
//       title: "Project Title",
//       desc: "Hold up! 🔒 Who goes there? 🕵️‍♂️ Only logged-in members can enter the protected routes. So pop in your email and password below, and you good to go 🛤️",
//     },
//   },
//   success: {
//     login: "Login berhasil!",
//     logout: "Logout berhasil!",
//     copy: "Berhasil disalin ke clipboard",
//     createAccountDialog: "Pengguna berhasil ditambah!",
//     deleteAccountDialog: (name: string) => `${name} berhasil dihapus!`,
//   },
//   loading: {
//     default: "Mohon tunggu sebentar...",
//     button: "Memproses...",
//     refresh: "Refreshing...",
//   },
//   error: {
//     login: {
//       notFound: "Akun tidak terdaftar!",
//       emailOrPassword: "Email atau Password Salah!",
//       pending:
//         "Akun Anda masih dalam antrian persetujuan. Harap tunggu konfirmasi dari admin.",
//     },
//     regis: "Email sudah terdaftar!",
//     deleteUser: "Tidak dapat menghapus Pengguna yang sedang digunakan",
//     fileSize: "Ukuran Gambar Terlalu Besar!",
//     fileRequired: (f: string) => `Mohon upload ${f}!`,
//     fileUpload: "Terjadi kesalahan saat mengupload file!",
//     protectedPath: "Protected Path Invalid!",
//     breadcrumb: "Menu Path Invalid!",
//     parsedNumber: "Parsed Number Invalid!",
//   },
//   button: {
//     login: "Login",
//     logout: "Logout",
//     refresh: "Refresh",
//     createAccountDialog: "Tambah Pengguna",
//   },
// };

const currentYear = new Date().getFullYear();

const path = {
  login: "/login",
  protected: "/dashboard",
  createAccount: "/dashboard/account",
};

const title = {
  primary: "Project Title",
  description: "Project Description",
};

const page = {
  metadata: (currentPage: string) => `${title.primary} | ${currentPage}`,
  copyright: `Copyright © ${currentYear}. Project Maker. All rights reserved.`,

  login: {
    title: `${title.primary} Admin`,
    subtitle: `Silakan masukkan email dan password akun Admin Anda dibawah ini untuk mengakses ${title.primary} Dashboard.`,
  },
};

const label = {
  error: {
    protectedPath: "Protected Path Invalid!",
    breadcrumb: "Menu Path Invalid!",
    parsedNumber: "Parsed Number Invalid!",
  },

  toast: {
    loading: {
      default: "Mohon Tunggu Sebentar...",
      refresh: "Refreshing...",
    },

    success: {
      login: "Login Berhasil!",
      logout: "Logout Berhasil!",
      copy: "Berhasil disalin ke clipboard",

      user: {
        create: "Pengguna berhasil ditambah!",
        delete: (name: string) => `${name} berhasil dihapus!`,
      },
    },

    error: {
      file: {
        size: "Ukuran Gambar Terlalu Besar!",
        required: (name: string) => `Mohon upload ${name}!`,
        upload: "Terjadi kesalahan saat mengupload file!",
      },

      login: {
        notFound: "Akun tidak terdaftar!",
        emailOrPassword: "Email atau Password Salah!",
        pending:
          "Akun Anda masih dalam antrian persetujuan. Harap tunggu konfirmasi dari admin.",
      },

      user: {
        email: "Email sudah terdaftar!",
        delete: "Tidak dapat menghapus Pengguna yang sedang digunakan",
      },
    },
  },

  button: {
    loading: "Memproses...",
    login: `Masuk ke ${title.primary} Admin`,
    logout: "Keluar",
    refresh: "Refresh",
  },
};

export { path, title, page, label };
