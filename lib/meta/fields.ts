import { CalendarProps } from "@/components/ui/calendar";
import { FileUploadProps } from "@/components/ui/file-upload";
import { IconOrText } from "@/components/ui/icons";
import { MultiSelectConfig } from "@/components/ui/multi-select";
import {
  Calendar1,
  CalendarClock,
  CalendarIcon,
  Check,
  CheckCheck,
  ChevronDown,
  CircleDot,
  Clock,
  EyeOff,
  File,
  GitCommit,
  LinkIcon,
  LockKeyhole,
  LockKeyholeOpen,
  Mail,
  PaintBucket,
  Phone,
  Search,
  SquareStack,
  TextIcon,
  Type,
  UserRound,
} from "lucide-react";
import { allRoles, rolesMeta } from "../permission";
import { appMeta } from "./app";

export const allFieldType = [
  "text",
  "color",
  "date",
  "datetime-local",
  "email",
  "hidden",
  "password",
  "range",
  "search",
  "time",
  "url",

  "number",
  "tel",

  "select",
  "multi-select",

  "checkbox",
  "multi-checkbox",

  "radio",
  "calendar",
  "textarea",
  "file",
] as const;

export type FieldType = (typeof allFieldType)[number];
export const fieldTypeMeta: Record<FieldType, { icon: IconOrText }> = {
  text: { icon: Type },
  color: { icon: PaintBucket },
  date: { icon: Calendar1 },
  "datetime-local": { icon: CalendarClock },
  email: { icon: Mail },
  hidden: { icon: EyeOff },
  password: { icon: LockKeyhole },
  range: { icon: GitCommit },
  search: { icon: Search },
  time: { icon: Clock },
  url: { icon: LinkIcon },

  number: { icon: "123" },
  tel: { icon: Phone },

  select: { icon: ChevronDown },
  "multi-select": { icon: SquareStack },

  checkbox: { icon: Check },
  "multi-checkbox": { icon: CheckCheck },

  radio: { icon: CircleDot },
  calendar: { icon: CalendarIcon },
  textarea: { icon: TextIcon },
  file: { icon: File },
};

type BaseFieldProps = {
  className?: string;
  placeholder?: string;
  required?: boolean;
  icon?: IconOrText;
};

export type FieldWrapperProps = Pick<BaseFieldProps, "required"> & {
  label: string;
  description?: string;
  classNames?: {
    label?: string;
    formItem?: string;
    formDescription?: string;
    formMessage?: string;
  };
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
    icon?: IconOrText;
    className?: string;
    disabled?: boolean;
  }[];
};

export type MultiSelectFieldProps = Pick<BaseFieldProps, "placeholder"> & {
  type: "multi-select";
  data: MultiSelectConfig[];
};

export type CheckboxFieldProps = Pick<BaseFieldProps, "className"> & {
  type: "checkbox";
};

export type MultiCheckboxFieldProps = Pick<BaseFieldProps, "className"> & {
  type: "multi-checkbox";
  id: string;
};

export type RadioFieldProps = Pick<BaseFieldProps, "className"> & {
  type: "radio";
  data: {
    value: string;
    label?: string;
    desc?: string;
    icon?: IconOrText;
    className?: string;
    disabled?: boolean;
  }[];
};

export type CalendarFieldProps = Omit<CalendarProps, "selected" | "onChange"> &
  Pick<BaseFieldProps, "placeholder"> & { type: "calendar" };

export type TextareaFieldProps = Pick<
  React.ComponentProps<"textarea">,
  "minLength" | "maxLength" | "rows"
> &
  Omit<BaseFieldProps, "icon"> & { type: "textarea" };

export type FileUploadFieldProps = Omit<
  FileUploadProps,
  "value" | "onChange"
> & { type: "file" };

export type FieldProps = FieldWrapperProps &
  (
    | InputFieldProps
    | NumericFieldProps
    | SelectFieldProps
    | MultiSelectFieldProps
    | CheckboxFieldProps
    | MultiCheckboxFieldProps
    | RadioFieldProps
    | CalendarFieldProps
    | TextareaFieldProps
    | FileUploadFieldProps
  );

// ? meta for common used fields
export const fieldsMeta = {
  num: "No",
  createdAt: "Tanggal dibuat",

  user: {
    id: "ID pengguna",
    avatar: "Foto profil",

    name: {
      type: "text",
      label: "Nama pengguna",
      placeholder: "Masukkan nama pengguna Anda",
      icon: UserRound,
      required: true,
    },
    email: {
      type: "email",
      label: "Alamat email",
      placeholder: "Masukkan alamat email Anda",
      icon: fieldTypeMeta.email.icon,
      required: true,
    },
    password: {
      type: "password",
      label: "Kata sandi",
      placeholder: "Masukkan kata sandi Anda",
      icon: fieldTypeMeta.password.icon,
      required: true,
    },
    confirmPassword: {
      type: "password",
      label: "Konfirmasi kata sandi",
      placeholder: "Konfirmasi kata sandi Anda",
      icon: fieldTypeMeta.password.icon,
      required: true,
    },
    currentPassword: {
      type: "password",
      label: "Kata sandi saat ini",
      placeholder: "Masukkan kata sandi saat ini",
      icon: LockKeyholeOpen,
      required: true,
    },
    newPassword: {
      type: "password",
      label: "Kata sandi baru",
      placeholder: "Masukkan kata sandi baru",
      icon: fieldTypeMeta.password.icon,
      required: true,
    },
    rememberMe: {
      type: "checkbox",
      label: "Ingat saya",
    },
    revokeOtherSessions: {
      type: "checkbox",
      label: "Keluar dari perangkat lainnya",
    },
    agreement: {
      type: "checkbox",
      label: "Setujui syarat dan ketentuan",
      description: `Saya menyetujui ketentuan layanan dan kebijakan privasi ${appMeta.name}.`,
      required: true,
    },
    role: {
      type: "radio",
      label: "Role",
      data: allRoles.map((value) => {
        const { displayName, ...rest } = rolesMeta[value];
        return { value, label: displayName, ...rest };
      }),
      required: true,
      className: "grid grid-cols-2",
    },
  },
} satisfies Record<string, string | Record<string, string | FieldProps>>;
