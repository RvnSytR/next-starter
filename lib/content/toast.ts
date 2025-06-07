export const toastMessage = {
  default: {
    loading: "Processing your request...",
    error: "Uh-oh! Something went wrong. Please try again later.",
    success: (
      thing: string,
      action: "created" | "updated" | "removed" | "terminated",
      target: string = "Your",
    ) => `${target} ${thing} has been ${action} successfully.`,
  },

  noChanges: (thing: string, target: string = "your") =>
    `No changes were made to ${target} ${thing}.`,

  user: {
    signIn: (name?: string) =>
      `Signed in successfully${name ? `, Welcome ${name}!` : "!"}`,
    signUp:
      "Your account has been registered successfully! Please sign in to continue.",
    signOut: "Signed out successfully.",
    changeRole: (name: string, role: string) =>
      `${name}'s role has been successfully updated to ${role}!`,
    revokeSession: (name: string) =>
      `All ${name}'s sessions have been terminated successfully.`,
  },
};
