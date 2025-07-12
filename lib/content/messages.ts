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
    `${browser ?? "A browser"} on ${os ?? "an unknown OS"}`,
  tooManyRequest: "Too many requests. Please try again later.",

  invalid: {
    email: "That doesn't look like a valid email address.",
    text: "Please enter valid text.",
    number: "Please enter a valid number.",
    color: "That doesn't appear to be a valid color code.",
    phone: "Please enter a valid phone number.",
    URL: "That URL doesn't seem valid.",
    time: "Please enter a valid time.",
    date: "Please enter a valid date.",
    dateMultiple: "Some of the dates entered are invalid.",
    dateRange: {
      field: "Please select a valid date range.",
      from: "Please choose a valid start date.",
      to: "Please choose a valid end date.",
    },

    ageRange: (min: number, max: number) =>
      `Age must be between ${min} and ${max}.`,

    fileType: (file: FileType = "file", withAccepted: boolean = false) =>
      `That's not a valid ${file} type.${
        withAccepted
          ? " Accepted types: " + mediaMeta[file].extensions.join(", ")
          : ""
      }`.trim(),

    selection: (field: string) => `That's not a valid option for ${field}.`,
  },

  tooShort: (field: string, min: number) =>
    `${field} needs to be at least ${min} characters.`,
  tooLong: (field: string, max: number) =>
    `${field} can't be longer than ${max} characters.`,
  outOfRange: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max} characters.`,

  invalidField: (field: string, fieldType: FieldType) =>
    `${field} must be a valid ${fieldType}.`,
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
