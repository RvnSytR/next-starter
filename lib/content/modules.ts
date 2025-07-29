import { messages } from "./messages";

const user = {
  verified: "Pengguna ini telah memverifikasi email mereka.",
  current: (thing: "user" | "session") =>
    `${thing === "user" ? "Pengguna" : "Sesi"} saat ini`,
  lastSeen: (time: Date) => messages.thingAgo("Terakhir terlihat", time),

  signIn: "Berhasil masuk — Selamat datang!",
  signUp: "Semua sudah siap! Silakan masuk untuk melanjutkan.",
  signOut: "Berhasil keluar — Sampai jumpa!",
  changeRole: (name: string, role: string) =>
    `Peran ${name} sekarang diatur menjadi ${role}.`,

  confirmPassword: "Kata sandi tidak cocok — silakan periksa kembali.",
  updatePassword: messages.success("kata sandi", "updated"),

  agreement:
    "Anda perlu menyetujui Ketentuan Layanan dan Kebijakan Privasi untuk melanjutkan.",
  notAuthorized: "Anda tidak memiliki izin untuk melakukan tindakan ini.",

  detail: {
    title: (name: string) => `Detail ${name}`,
    desc: (name: string) => `Lihat informasi detail untuk ${name}.`,
  },

  fields: {
    userId: "ID Pengguna",
    avatar: "Avatar",
    rememberMe: "Ingat saya",
    profilePic: "Foto Profil",
    role: "Peran",

    changeRole: (name: string) => `Ubah peran ${name}`,

    email: { label: "Alamat email", placeholder: "Masukkan alamat email Anda" },
    name: {
      label: "Nama pengguna",
      placeholder: "Masukkan nama pengguna Anda",
    },
    password: { label: "Kata sandi", placeholder: "Masukkan kata sandi Anda" },
    currentPassword: {
      label: "Kata Sandi Saat Ini",
      placeholder: "Masukkan kata sandi saat ini Anda",
    },
    newPassword: {
      label: "Kata Sandi Baru",
      placeholder: "Masukkan kata sandi baru Anda",
    },
    confirmPassword: {
      label: "Konfirmasi Kata Sandi",
      placeholder: "Konfirmasi kata sandi Anda",
    },
    agreement: {
      label: "Setujui syarat dan ketentuan",
      placeholder: "Saya menyetujui ketentuan layanan dan kebijakan privasi.",
    },
  },

  components: {
    profilePic: {
      title: "Hapus Foto Profil",
      desc: "Ini akan menghapus foto profil Anda saat ini. Anda yakin ingin melanjutkan?",
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
      desc: "Ini akan langsung keluar dari perangkat yang dipilih. Anda yakin ingin melanjutkan?",
      success: "Sesi ini telah dicabut.",
    },

    revokeAllOtherSession: {
      trigger: "Cabut Sesi Lain",
      title: "Cabut Semua Sesi Lain",
      desc: "Ini akan keluar dari semua sesi aktif kecuali sesi saat ini. Anda yakin ingin melanjutkan?",
      success: "Semua sesi aktif lainnya telah dicabut.",
    },

    delete: {
      trigger: "Hapus Akun",
      title: "Hapus Akun Anda",
      desc: "Menghapus akun Anda akan secara permanen menghapus semua data yang terkait. Harap berhati-hati karena tindakan ini tidak dapat dibatalkan.",
      success: messages.success("akun", "removed"),
    },

    adminCreate: {
      trigger: "Buat Pengguna",
      title: "Buat Pengguna Baru",
      desc: "Buat pengguna baru dengan memasukkan detail mereka. Pastikan semua bidang yang diperlukan telah diisi.",
      success: (name: string) => messages.success(`akun ${name}`, "created"),
    },

    adminRevokeSessions: {
      trigger: "Cabut Sesi",

      title: (name: string) => `Cabut Semua Sesi Aktif untuk ${name}`,
      desc: (name: string) =>
        `Ini akan langsung keluar dari semua sesi aktif milik ${name}. Anda yakin ingin melanjutkan?`,
      success: (name?: string) =>
        `Semua sesi aktif ${name ? `milik ${name}` : "pengguna"} telah dicabut.`,

      titleMultiple: (length: number) => `Cabut Sesi untuk ${length} Pengguna`,
      descMultiple: (length: number) =>
        `Ini akan langsung keluar dari semua sesi aktif untuk ${length} pengguna yang dipilih. Anda yakin ingin melanjutkan?`,
      successMultiple: (success: number, length: number) =>
        `${success} dari ${length} sesi aktif pengguna berhasil dicabut.`,
    },

    adminRemove: {
      title: (name: string) => `Hapus Akun ${name}`,
      desc: (name: string) =>
        `Ini akan secara permanen menghapus akun ${name} dan semua data yang terkait. Harap berhati-hati karena tindakan ini tidak dapat dibatalkan.`,

      titleMultiple: (length: number) => `Hapus ${length} Akun`,
      descMultiple: (length: number) =>
        `Ini akan secara permanen menghapus ${length} akun pengguna yang dipilih dan semua data yang terkait. Harap berhati-hati karena tindakan ini tidak dapat dibatalkan.`,
      successMultiple: (success: number, length: number) =>
        messages.success(`${success} dari ${length} akun pengguna`, "removed"),
    },
  },
};

export const baseContent = { user };
