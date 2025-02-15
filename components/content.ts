const currentYear = new Date().getFullYear();

const color = { primary: "#81F5FF" };

const image = {};

const title = { primary: "Project Title", description: "Project Description" };

const page = {
  metadata: (currentPage: string) => `${title.primary} | ${currentPage}`,
  copyright: `Copyright © ${currentYear}. Project Maker. All rights reserved.`,

  login: {
    title: `${title.primary} Admin`,
    subtitle: `Silakan masukkan email dan password akun Admin Anda dibawah ini untuk mengakses ${title.primary} Dashboard.`,
  },

  settings: {
    profile: {
      title: "Ubah Profile",
      subtitle:
        "Setelah melakukan perubahan pada profil, sistem akan meminta Anda untuk login kembali. Pastikan informasi sudah benar sebelum melanjutkan.",
    },

    password: {
      title: "Ubah Password",
      subtitle:
        "Setelah melakukan perubahan password, sistem akan meminta Anda untuk login kembali. Pastikan informasi sudah benar sebelum melanjutkan.",
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
    loading: { default: "Mohon Tunggu Sebentar..." },

    success: {
      login: "Login Berhasil!",
      logout: "Logout Berhasil!",

      user: {
        create: "Pengguna berhasil ditambah!",

        approve: (name: string, role: string) =>
          `${name} berhasil disetujui sebagai ${role.toWellFormed()}.`,

        update: {
          profile: "Profile Berhasil Diperbarui! Mohon Login Kembali",
          password: "Password Berhasil Diperbarui! Mohon Login Kembali",
        },

        delete: (name: string) => `${name} berhasil dihapus!`,
      },
    },

    error: {
      file: {
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
    login: `Masuk ke ${title.primary} Admin`,
    logout: "Keluar",
    refresh: "Refresh",
  },
};

export { title, page, label, color, image };
