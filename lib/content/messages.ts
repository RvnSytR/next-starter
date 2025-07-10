import { Action, FieldType, FileType, mediaMeta } from "../const";
import { aOrAn, capitalize, formatDateDistanceToNow } from "../utils";

export const messages = {
  loading: "Just a moment...",
  error: "Uh-oh! Something went wrong. Please try again later.",
  success: (thing: string, action: Action) =>
    `${thing} has been ${action} successfully.`.trim(),

  thingAgo: (thing: string, time: Date) =>
    `${thing} ${formatDateDistanceToNow(time)} ago.`,
  browserOnOS: (browser: string | undefined, os: string | undefined) =>
    `${browser ?? "A browser"} on ${os ?? "some OS"}`,
  tooManyRequest: "Too many requests. Please try again later.",

  invalid: {
    email: "Hmm, that doesn't look like a valid email.",
    phone: "That doesn't seem like a valid phone number.",
    URL: "That URL doesn't look quite right.",
    time: "Please enter a proper time.",
    date: "That doesn't seem like a valid date.",
    dateMultiple: "Those don't seem like valid dates.",
    dateRange: {
      field: "Please select a valid range of dates.",
      from: "Please choose a valid start date.",
      to: "Please choose a valid end date.",
    },

    ageRange: (min: number, max: number) =>
      `Age must be between ${min} and ${max}.`,

    fileType: (file: FileType = "file", withAccepted: boolean = false) =>
      `That's not a valid ${file} type.${
        withAccepted
          ? " Accepted: " + mediaMeta[file].extensions.join(", ")
          : ""
      }`.trim(),

    selection: (field: string) => `That's not a valid option for ${field}.`,

    number: "That doesn't look like a valid number.",
    text: "Please enter valid text.",
    color: "That doesn't seem like a valid color code.",
  },

  tooShort: (field: string, min: number) =>
    `${field} needs to be at least ${min} characters long.`,
  tooLong: (field: string, max: number) =>
    `${field} can't be longer than ${max} characters.`,
  outOfRange: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max} characters.`,

  invalidField: (field: string, fieldType: FieldType) =>
    `${field} should be a valid ${fieldType}.`,
  requiredAndInvalidField: (field: string, fieldType: FieldType) =>
    `${field} is required and must be a valid ${fieldType}.`,

  fileRequired: (file: FileType = "file", multiple: boolean = false) =>
    `Please upload ${multiple ? "one or more" : aOrAn(file)} ${file}.`,
  fileTooLarge: (file: FileType = "file", maxSizeMB: number) =>
    `${capitalize(file)} size must be under ${maxSizeMB} MB.`,

  noChanges: (thing: string) => `No changes were made to your ${thing}.`,
  mustSelectOne: (field: string) => `Please choose one ${field}.`,

  duplicate: (thing: string) => `This ${thing} already exists.`,
  conflict: (thing: string) => `There's a conflict with an existing ${thing}.`,
  deleteForbidden: (thing: string, x: string) =>
    `This ${thing} cannot be deleted because it is currently assigned to ${x}.`,
};
