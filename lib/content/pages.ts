import { appInfo } from "../const";

const signIn = {
  title: appInfo.name,
  desc: `Masuk ke Dashboard ${appInfo.name} dengan aman menggunakan akun Anda.`,
};

const users = {
  title: "Pengguna",
  desc: "Kelola dan lihat detail semua pengguna yang telah terdaftar.",
  searchPlaceholder: "Cari pengguna...",
};

const profile = {
  info: {
    title: "Informasi Pribadi",
    desc: `Perbarui dan kelola informasi profil ${appInfo.name} Anda.`,
  },

  password: {
    title: "Ubah Kata Sandi",
    desc: "Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.",
  },

  activeSession: {
    title: "Sesi Aktif",
    desc: "Tinjau dan kelola perangkat atau sesi yang saat ini sedang masuk ke akun Anda.",
  },

  deleteAccount: {
    title: "Hapus Akun",
    desc: "Peringatan: Tindakan ini bersifat permanen dan tidak dapat dibatalkan.",
  },
};

export const pages = { signIn, users, profile };
