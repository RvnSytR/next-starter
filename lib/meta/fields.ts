import { CalendarProps } from "@/components/ui/calendar";
import { FileUploadProps } from "@/components/ui/file-upload";
import { IconOrText } from "@/components/ui/icons";
import { MultiSelectConfig } from "@/components/ui/multi-select";
import {
  Calendar1,
  CalendarClock,
  CalendarIcon,
  Check,
  ChevronDown,
  CircleDot,
  Clock,
  Club,
  Diamond,
  EyeOff,
  File,
  GitCommit,
  Heart,
  LinkIcon,
  LockKeyhole,
  LockKeyholeOpen,
  Mail,
  PaintBucket,
  Phone,
  Search,
  Spade,
  SquareStack,
  TextIcon,
  Type,
  UserRound,
} from "lucide-react";
import { allRoles, rolesMeta } from "../permission";
import { appMeta } from "./app";
import { baseColorMeta, tailwindColorMeta } from "./color";
import { languageMeta } from "./other";

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

  "radio",
  "calendar",
  "checkbox",
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

  radio: { icon: CircleDot },
  calendar: { icon: CalendarIcon },
  checkbox: { icon: Check },
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

export type CheckboxFieldProps = Pick<BaseFieldProps, "className"> & {
  type: "checkbox";
};

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
    | RadioFieldProps
    | CalendarFieldProps
    | CheckboxFieldProps
    | TextareaFieldProps
    | FileUploadFieldProps
  );

export const fieldsMeta = {
  num: "No",
  createdAt: "Tanggal dibuat",

  example: {
    text: {
      type: "text",
      label: "Text",
      placeholder: "Masukkan text",
      icon: TextIcon,
      required: true,
      // description: "Form Description",
    },
    numeric: {
      type: "number",
      label: "Numeric",
      placeholder: "Masukkan nomor",
      icon: languageMeta.id.symbol,
      required: true,
    },
    phone: {
      type: "tel",
      label: "Phone",
      placeholder: "Masukkan no telp",
      icon: "+62",
      className: "pl-11",
      required: true,
    },
    select: {
      type: "select",
      label: "Select",
      placeholder: "Pilih kartu",
      data: [
        { value: "spade", label: "Spade", icon: Spade },
        { value: "heart", label: "Heart", icon: Heart, disabled: true },
        { value: "diamond", label: "Diamond", icon: Diamond },
        { value: "club", label: "Club", icon: Club },
      ],
      required: true,
    },
    multiSelect: {
      type: "multi-select",
      label: "Multi Select",
      placeholder: "Pilih beberapa kartu",
      data: [
        {
          value: "spade",
          label: "Spade",
          icon: Spade,
          color: baseColorMeta.primary,
          group: "Card 1",
        },
        {
          value: "heart",
          label: "Heart",
          icon: Heart,
          color: tailwindColorMeta["red-500"],
          group: "Card 1",
          disabled: true,
        },
        {
          value: "diamond",
          label: "Diamond",
          icon: Diamond,
          color: tailwindColorMeta["cyan-500"],
          group: "Card 2",
        },
        {
          value: "club",
          label: "Club",
          icon: Club,
          color: tailwindColorMeta["green-500"],
          group: "Card 2",
        },
      ],
      required: true,
    },
    radio: {
      type: "radio",
      label: "Radio Group",
      className: "flex-col md:flex-row",
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
          disabled: true,
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
    textarea: {
      type: "textarea",
      label: "Text Area",
      placeholder: "Masukkan text area",
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
    file: {
      type: "file",
      label: "File Upload",
      accept: "image",
      multiple: true,
    },
    checkbox: {
      type: "checkbox",
      label: "Checkbox",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      required: true,
    },
  },

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
