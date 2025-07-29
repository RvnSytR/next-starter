import { appInfo } from "../const";

const signIn = {
  title: appInfo.name,
  desc: `Akses Dashboard ${appInfo.name} dengan aman menggunakan kredensial Anda.`,
};

const users = {
  title: "Pengguna",
  desc: "Kelola dan lihat detail semua pengguna yang terdaftar.",
  searchPlaceholder: "Cari pengguna...",
};

const profile = {
  info: {
    title: "Informasi Pribadi",
    desc: `Perbarui dan kelola detail profil ${appInfo.name} Anda.`,
  },

  password: {
    title: "Ubah Kata Sandi",
    desc: "Pastikan kata sandi baru Anda kuat dan aman.",
  },

  activeSession: {
    title: "Sesi Aktif",
    desc: "Tinjau dan kelola perangkat serta sesi yang saat ini masuk ke akun Anda.",
  },

  deleteAccount: {
    title: "Hapus Akun",
    desc: "Peringatan: Menghapus akun Anda bersifat permanen dan tidak dapat dibatalkan.",
  },
};

export const pages = { signIn, users, profile };
