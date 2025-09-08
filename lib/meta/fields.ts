import { IconOrText } from "@/components/ui/icons";
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

// ! Only for fields that are commonly used in tables, details or displayed to users
export const fieldsMeta = {
  num: "No",
  updatedAt: "Waktu diperbarui",
  createdAt: "Waktu dibuat",

  user: {
    role: "Role",
    avatar: "Foto profil",

    name: {
      label: "Nama pengguna",
      placeholder: "Masukkan nama pengguna Anda",
      icon: UserRound,
      required: true,
    },
    email: {
      label: "Alamat email",
      placeholder: "Masukkan alamat email Anda",
      icon: fieldTypeMeta.email.icon,
      required: true,
    },
    password: {
      label: "Kata sandi",
      placeholder: "Masukkan kata sandi Anda",
      icon: fieldTypeMeta.password.icon,
      required: true,
    },
    newPassword: {
      label: "Kata sandi baru",
      placeholder: "Masukkan kata sandi baru",
      icon: fieldTypeMeta.password.icon,
      required: true,
    },
    confirmPassword: {
      label: "Konfirmasi kata sandi",
      placeholder: "Konfirmasi kata sandi Anda",
      icon: fieldTypeMeta.password.icon,
      required: true,
    },
    currentPassword: {
      label: "Kata sandi saat ini",
      placeholder: "Masukkan kata sandi saat ini",
      icon: LockKeyholeOpen,
      required: true,
    },
  },
};
