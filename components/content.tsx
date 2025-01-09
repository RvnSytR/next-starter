const currentYear = new Date().getFullYear();

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
    login: `Masuk ke ${title.primary} Admin`,
    logout: "Keluar",
    refresh: "Refresh",
  },
};

export { title, page, label };
