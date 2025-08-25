import { FieldProps } from "@/components/other/form-fields";
import {
  LockKeyhole,
  LockKeyholeOpen,
  Mail,
  TextIcon,
  UserRound,
} from "lucide-react";
import { getCurrencySymbol } from "../utils";

const createFields = <T extends Record<string, string | FieldProps>>(
  fields: T,
) => fields;

export const fieldsMeta = {
  num: "No",
  createdAt: "Tanggal Dibuat",

  example: createFields({
    text: {
      label: "Text",
      placeholder: "Masukkan Text",
      icon: TextIcon,
      required: true,
    },
    numeric: {
      type: "number",
      label: "Numeric",
      placeholder: "Masukkan Nomor",
      icon: getCurrencySymbol("id"),
      required: true,
    },
    phone: {
      type: "tel",
      label: "Phone",
      placeholder: "Masukkan No Telp",
      icon: "+62",
      className: "pl-11",
      required: true,
    },
    select: { label: "Select", required: true },
  }),

  user: createFields({
    id: "ID Pengguna",
    avatar: "Foto Profil",
    role: "Role",

    name: {
      label: "Nama Pengguna",
      placeholder: "Masukkan nama pengguna Anda",
      icon: UserRound,
    },

    email: {
      type: "email",
      label: "Alamat Email",
      placeholder: "Masukkan alamat email Anda",
      icon: Mail,
      required: true,
    },

    password: {
      type: "password",
      label: "Kata Sandi",
      placeholder: "Masukkan kata sandi Anda",
      icon: LockKeyhole,
      required: true,
    },

    confirmPassword: {
      type: "password",
      label: "Konfirmasi Kata Sandi",
      placeholder: "Konfirmasi kata sandi Anda",
      icon: LockKeyhole,
      required: true,
    },

    currentPassword: {
      type: "password",
      label: "Kata Sandi Saat Ini",
      placeholder: "Masukkan kata sandi saat ini",
      icon: LockKeyholeOpen,
    },

    newPassword: {
      type: "password",
      label: "Kata Sandi Baru",
      placeholder: "Masukkan kata sandi baru",
      icon: LockKeyhole,
    },
  }),
};
