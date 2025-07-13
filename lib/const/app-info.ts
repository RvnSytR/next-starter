import { enUS } from "date-fns/locale";
import { en } from "zod/locales";
import { Languages } from "./other";

export const appInfo = {
  name: "Project Title",
  description: "Project Description",
  keywords: ["next starter"],

  // logo: "/some-image.png"

  lang: "en" satisfies Languages as Languages,
  i18n: { date: enUS, zod: en },
};
