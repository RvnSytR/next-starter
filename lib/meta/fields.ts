import {
  Club,
  Diamond,
  Heart,
  LucideIcon,
  Spade,
  TextIcon,
} from "lucide-react";
import { allRoles, rolesMeta } from "../permission";
import { languagesMeta } from "./other";

export type FieldType =
  | "string"
  | "boolean"
  | "number"
  | "date"
  | "array"
  | "object";

export type FieldIcon = string | LucideIcon;

export type FieldWrapperProps = {
  label: string;
  desc?: string;
  required?: boolean;
  classNames?: { label?: string; formItem?: string; formMessage?: string };
};

export type BaseInputProps = {
  className?: string;
  placeholder?: string;
  icon?: FieldIcon;
};

export type InputFieldProps = BaseInputProps & {
  type:
    | "text"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "hidden"
    | "password"
    | "search"
    | "time"
    | "url";
};

export type NumericFieldProps = BaseInputProps & { type: "number" | "tel" };

export type SelectFieldProps = Pick<BaseInputProps, "placeholder"> & {
  type: "select";
  data: { value: string; icon?: FieldIcon }[];
};

export type RadioFieldProps = Pick<BaseInputProps, "className"> & {
  type: "radio";
  data: { value: string; desc?: string; icon?: FieldIcon }[];
};

export type FieldProps = FieldWrapperProps &
  (InputFieldProps | NumericFieldProps | SelectFieldProps | RadioFieldProps);

export const fieldsMeta = {
  num: "No",
  createdAt: "Tanggal Dibuat",

  example: {
    text: {
      type: "text",
      label: "Text",
      placeholder: "Masukkan Text",
      icon: TextIcon,
      required: true,
      // desc: "Form Description",
    },
    numeric: {
      type: "number",
      label: "Numeric",
      placeholder: "Masukkan Nomor",
      icon: "Rp.",
      required: true,
    },
    phone: {
      type: "tel",
      label: "Phone",
      placeholder: "Masukkan No Telp",
      icon: languagesMeta.id.symbol,
      className: "pl-11",
      required: true,
    },
    select: {
      type: "select",
      label: "Select",
      data: [
        { value: "Spade", icon: Spade },
        { value: "Heart", icon: Heart },
        { value: "Diamond", icon: Diamond },
        { value: "Club", icon: Club },
      ],
      required: true,
    },
    radio: {
      type: "radio",
      label: "Radio Group",
      data: [
        {
          value: "Spade",
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          icon: Spade,
        },
        {
          value: "Heart",
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          icon: Heart,
        },
        {
          value: "Diamond",
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          icon: Diamond,
        },
        {
          value: "Club",
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          icon: Club,
        },
      ],
      required: true,
    },
  },

  user: {
    id: "ID Pengguna",
    avatar: "Foto Profil",

    name: {
      type: "text",
      label: "Nama Pengguna",
      placeholder: "Masukkan nama pengguna Anda",
      // icon: "user-round",
      required: true,
    },

    email: {
      type: "email",
      label: "Alamat Email",
      placeholder: "Masukkan alamat email Anda",
      // icon: "mail",
      required: true,
    },

    password: {
      type: "password",
      label: "Kata Sandi",
      placeholder: "Masukkan kata sandi Anda",
      // icon: "lock-keyhole",
      required: true,
    },

    confirmPassword: {
      type: "password",
      label: "Konfirmasi Kata Sandi",
      placeholder: "Konfirmasi kata sandi Anda",
      // icon: "lock-keyhole",
      required: true,
    },

    currentPassword: {
      type: "password",
      label: "Kata Sandi Saat Ini",
      placeholder: "Masukkan kata sandi saat ini",
      // icon: "lock-keyhole-open",
      required: true,
    },

    newPassword: {
      type: "password",
      label: "Kata Sandi Baru",
      placeholder: "Masukkan kata sandi baru",
      // icon: "lock-keyhole",
      required: true,
    },

    role: {
      type: "radio",
      label: "Role",
      data: allRoles.map((item) => {
        const { displayName, desc } = rolesMeta[item];
        return { value: displayName, desc };
      }),
      required: true,
      className: "grid grid-cols-2",
    },
  },
} satisfies Record<string, string | Record<string, string | FieldProps>>;
