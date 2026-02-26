export type Role =
  | "USER"
  | "TESTER"
  | "DEVELOPER"
  | "MANAGER"
  | "ADMIN";

export type Screen =
  | "dashboard"
  | "report-defect"
  | "defect-list"
  | "defect-details"
  | "analytics";

export const roleAccess: Record<Role, Screen[]> = {
  USER: ["report-defect"],

  TESTER: [
    "dashboard",
    "report-defect",
    "defect-list",
    "defect-details",
  ],

  DEVELOPER: ["dashboard", "defect-list", "defect-details"],

  MANAGER: ["dashboard", "defect-list","analytics"],

  ADMIN: [
    "dashboard",
    "report-defect",
    "defect-list",
    "defect-details",
    "analytics",
  ],
};

export const statusPermissions: Record<Role, string[]> = {
  USER: [],

  TESTER: [],

  DEVELOPER: ["ASSIGNED", "IN_PROGRESS"],

  MANAGER: ["FIXED", "VERIFICATION", "CLOSED"],

  ADMIN: ["*"], 
};

export const canAccessScreen = (role: Role, screen: Screen) =>
  roleAccess[role]?.includes(screen);

export const canUpdateStatus = (role: Role, currentStatus: string) => {
  if (role === "ADMIN") return true;
  return statusPermissions[role]?.includes(currentStatus);
};