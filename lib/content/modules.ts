import { messages } from "./messages";

const user = {
  verified: "Pengguna ini telah memverifikasi email mereka.",
  current: (thing: "user" | "session") =>
    `${thing === "user" ? "Pengguna" : "Sesi"} saat ini`,
  lastSeen: (time: Date) => messages.thingAgo("Terakhir terlihat", time),

  signIn: "Berhasil masuk — Selamat datang!",
  signUp: "Akun berhasil dibuat! Silakan masuk untuk melanjutkan.",
  signOut: "Berhasil keluar — Sampai jumpa!",
  changeRole: (name: string, role: string) =>
    `Role ${name} kini diatur sebagai ${role}.`,

  confirmPassword: "Kata sandi tidak cocok — silakan periksa kembali.",
  updatePassword: messages.success("Kata sandi", "updated"),

  agreement:
    "Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi untuk melanjutkan.",
  notAuthorized: "Anda tidak memiliki izin untuk melakukan tindakan ini.",

  fields: {
    userId: "ID Pengguna",
    avatar: "Foto Profil",
    role: "Role",
    rememberMe: "Ingat saya",

    changeRole: (name: string) => `Ubah role ${name}`,

    email: { label: "Alamat Email", placeholder: "Masukkan alamat email Anda" },
    name: {
      label: "Nama Pengguna",
      placeholder: "Masukkan nama pengguna Anda",
    },
    password: {
      label: "Kata Sandi",
      placeholder: "Masukkan kata sandi Anda",
    },
    currentPassword: {
      label: "Kata Sandi Saat Ini",
      placeholder: "Masukkan kata sandi saat ini",
    },
    newPassword: {
      label: "Kata Sandi Baru",
      placeholder: "Masukkan kata sandi baru",
    },
    confirmPassword: {
      label: "Konfirmasi Kata Sandi",
      placeholder: "Konfirmasi kata sandi baru Anda",
    },
    agreement: {
      label: "Setujui syarat dan ketentuan",
      placeholder: "Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi.",
    },
  },

  components: {
    detail: {
      title: (name: string) => `Detail ${name}`,
      desc: (name: string) => `Lihat informasi lengkap tentang ${name}.`,
    },

    profilePic: {
      title: "Hapus Foto Profil",
      desc: "Ini akan menghapus foto profil Anda saat ini. Yakin ingin melanjutkan?",
      success: (isUpdate?: boolean) =>
        messages.success("Foto profil Anda", isUpdate ? "updated" : "removed"),
    },

    personalInfo: {
      noChanges: messages.noChanges("profil"),
      success: messages.success("Profil", "updated"),
    },

    revokeSession: {
      trigger: "Cabut Sesi",
      title: "Cabut Sesi Aktif",
      desc: "Sesi ini akan segera dihentikan dari perangkat yang dipilih. Yakin ingin melanjutkan?",
      success: "Sesi ini telah dicabut.",
    },

    revokeAllOtherSession: {
      trigger: "Cabut Sesi Lain",
      title: "Cabut Semua Sesi Lain",
      desc: "Semua sesi aktif lainnya akan dihentikan, kecuali sesi saat ini. Yakin ingin melanjutkan?",
      success: "Semua sesi aktif lainnya telah dicabut.",
    },

    delete: {
      trigger: "Hapus Akun",
      title: "Hapus Akun Anda",
      desc: "Tindakan ini akan secara permanen menghapus semua data akun Anda. Harap berhati-hati karena tidak dapat dibatalkan.",
      success: messages.success("Akun", "removed"),
    },

    adminCreate: {
      trigger: "Buat Pengguna",
      title: "Buat Pengguna Baru",
      desc: "Isi detail pengguna baru dengan lengkap. Pastikan semua bidang wajib diisi.",
      success: (name: string) => messages.success(`Akun ${name}`, "created"),
    },

    adminRevokeSessions: {
      trigger: "Cabut Sesi",

      title: (name: string) => `Cabut Semua Sesi Aktif untuk ${name}`,
      desc: (name: string) =>
        `Tindakan ini akan langsung menghentikan semua sesi aktif milik ${name}. Yakin ingin melanjutkan?`,
      success: (name?: string) =>
        `Semua sesi aktif ${name ? `milik ${name}` : "pengguna"} telah dicabut.`,

      titleMultiple: (length: number) => `Cabut Sesi untuk ${length} Pengguna`,
      descMultiple: (length: number) =>
        `Ini akan menghentikan semua sesi aktif dari ${length} pengguna yang dipilih. Yakin ingin melanjutkan?`,
      successMultiple: (success: number, length: number) =>
        `${success} dari ${length} sesi pengguna berhasil dicabut.`,
    },

    adminRemove: {
      title: (name: string) => `Hapus Akun ${name}`,
      desc: (name: string) =>
        `Tindakan ini akan menghapus akun ${name} beserta seluruh datanya secara permanen. Harap berhati-hati karena tidak dapat dibatalkan.`,

      titleMultiple: (length: number) => `Hapus ${length} Akun`,
      descMultiple: (length: number) =>
        `Ini akan menghapus ${length} akun yang dipilih beserta seluruh datanya secara permanen. Harap berhati-hati karena tidak dapat dibatalkan.`,
      successMultiple: (success: number, length: number) =>
        messages.success(`${success} dari ${length} akun pengguna`, "removed"),
    },
  },
};

export const baseContent = { user };
