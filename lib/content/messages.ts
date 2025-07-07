import { FieldType, FileType, mediaMeta } from "../const";
import { aOrAn, capitalize, formatDateDistanceToNow } from "../utils";

type Action = "created" | "updated" | "removed";

const baseMessages = {
  loading: "Just a moment...",
  error: "Uh-oh! Something went wrong. Please try again later.",
  success: (thing: string, action: Action) =>
    `${thing} has been ${action} successfully.`.trim(),

  lastThingAgo: (thing: string, time: Date) =>
    `Last ${thing} ${formatDateDistanceToNow(time)} ago.`,
  browserOnOS: (browser: string | undefined, os: string | undefined) =>
    `${browser ?? "A browser"} on ${os ?? "some OS"}`,

  invalid: {
    email: "Hmm, that doesn't look like a valid email.",
    phone: "That doesn't seem like a valid phone number.",
    URL: "That URL doesn't look quite right.",
    time: "Please enter a proper time.",
    date: "That doesn't seem like a valid date.",
    dateMultiple: "That doesn't seem like a valid dates.",
    dateRange: {
      field: "Please select a valid range of dates.",
      from: "Please choose a valid start date.",
      to: "Please choose a valid end date.",
    },

    ageRange: (min: number, max: number) =>
      `Age must be between ${min} and ${max}.`,

    fileType: (file: FileType = "file", withAccepted: boolean = false) =>
      `Hmm, that's not a valid ${file} type.${
        withAccepted
          ? " Accepted types: " + mediaMeta[file].extensions.join(", ")
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

export const messages = {
  ...baseMessages,

  user: {
    success: (thing: string, action: Action) =>
      `Your ${baseMessages.success(thing, action)}`,
    noChanges: (thing: string) => `Your ${baseMessages.noChanges(thing)}`,

    signIn: (name?: string) =>
      `Signed in successfully${name ? ` — welcome ${name}!` : "!"}`,
    signUp: "You're all set! Please sign in to get started.",
    signOut: "You've been signed out. See you soon!",

    confirmPassword: "Passwords don't match — please double-check.",
    agreement:
      "You'll need to agree to the Terms of Service and Privacy Policy to continue.",

    notAuthorized: "You do not have permission to perform this action.",
    changeRole: (name: string, role: string) =>
      `${name}'s role is now set to ${role}.`,

    current: (thing: "user" | "session") => `Current ${thing}`,
    lastSeen: (time: Date) => baseMessages.lastThingAgo("seen", time),

    revokeThisSession: "This session has been revoked.",
    revokeOtherSessions: "Your other active sessions has been revoked.",
    revokeUserSession: (name?: string) =>
      `${name ? name + "'s" : "All user"} active sessions have been revoked.`,

    removeUsers: (success: number, length: number) =>
      baseMessages.success(`${success} out of ${length} users`, "removed"),
  },
};
