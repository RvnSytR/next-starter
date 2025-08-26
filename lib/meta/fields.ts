import {
  Club,
  Diamond,
  Heart,
  LucideIcon,
  Spade,
  TextIcon,
} from "lucide-react";
import { allRoles, rolesMeta } from "../permission";

export type FieldType =
  | "string"
  | "boolean"
  | "number"
  | "date"
  | "array"
  | "object";

export type InputTypeAttribute =
  | "number"
  // | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  // | "file"
  | "hidden"
  // | "image"
  | "month"
  | "password"
  | "radio"
  | "range"
  // | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export type FieldIcon = string | LucideIcon;

export type FieldWrapperProps = {
  label: string;
  required?: boolean;
  classNames?: { label?: string; formItem?: string; formMessage?: string };
};

export type BaseInputProps = {
  className?: string;
  placeholder?: string;
  icon?: FieldIcon;
  wrapperClassName?: string;
};

export type TextFieldProps = BaseInputProps & {
  type: Exclude<InputTypeAttribute, "number" | "tel" | "select" | "radio">;
};

export type NumberFieldProps = BaseInputProps & { type: "number" | "tel" };

export type SelectFieldProps = Pick<BaseInputProps, "placeholder"> & {
  type: "select";
  data: { value: string; icon?: FieldIcon }[];
};

export type RadioFieldProps = Pick<BaseInputProps, "className"> & {
  type: "radio";
  data: { value: string; desc?: string; icon?: FieldIcon }[];
};

export type FieldProps = FieldWrapperProps &
  (TextFieldProps | NumberFieldProps | SelectFieldProps | RadioFieldProps);

const createFields = <T extends Record<string, string | FieldProps>>(
  fields: T,
) => fields;

export const fieldsMeta = {
  num: "No",
  createdAt: "Tanggal Dibuat",

  example: createFields({
    text: {
      type: "text",
      label: "Text",
      placeholder: "Masukkan Text",
      icon: TextIcon,
      required: true,
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
      icon: "+62",
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
  }),

  user: createFields({
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
  }),
};
