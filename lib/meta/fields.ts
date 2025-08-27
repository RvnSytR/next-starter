import { CalendarProps } from "@/components/ui/calendar";
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

type BaseFieldProps = {
  className?: string;
  placeholder?: string;
  required?: boolean;
  icon?: FieldIcon;
};

export type FieldWrapperProps = Pick<BaseFieldProps, "required"> & {
  label: string;
  desc?: string;
  classNames?: { label?: string; formItem?: string; formMessage?: string };
};

export type InputFieldProps = BaseFieldProps & {
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

export type NumericFieldProps = BaseFieldProps & { type: "number" | "tel" };

export type SelectFieldProps = Pick<BaseFieldProps, "placeholder"> & {
  type: "select";
  data: {
    value: string;
    label?: string;
    icon?: FieldIcon;
    className?: string;
  }[];
};

export type RadioFieldProps = Pick<BaseFieldProps, "className"> & {
  type: "radio";
  data: {
    value: string;
    label?: string;
    desc?: string;
    icon?: FieldIcon;
    className?: string;
  }[];
};

export type CalendarFieldProps = Required<Pick<CalendarProps, "mode">> &
  Pick<BaseFieldProps, "placeholder" | "required"> & { type: "calendar" };

export type FieldProps = FieldWrapperProps &
  (
    | InputFieldProps
    | NumericFieldProps
    | SelectFieldProps
    | RadioFieldProps
    | CalendarFieldProps
  );

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
        { value: "spade", label: "Spade", icon: Spade },
        { value: "heart", label: "Heart", icon: Heart },
        { value: "diamond", label: "Diamond", icon: Diamond },
        { value: "club", label: "Club", icon: Club },
      ],
      required: true,
    },
    radio: {
      type: "radio",
      label: "Radio Group",
      data: [
        {
          value: "spade",
          label: "Spade",
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          icon: Spade,
        },
        {
          value: "heart",
          label: "Heart",
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          icon: Heart,
        },
        {
          value: "diamond",
          label: "Diamond",
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          icon: Diamond,
        },
        {
          value: "club",
          label: "Club",
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          icon: Club,
        },
      ],
      required: true,
    },
    calendar: {
      type: "calendar",
      mode: "single",
      label: "Date with Calendar",
      required: true,
    },
    calendarMultiple: {
      type: "calendar",
      mode: "multiple",
      label: "Date Multiple",
      required: true,
    },
    calendarRange: {
      type: "calendar",
      mode: "range",
      label: "Date Range",
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
