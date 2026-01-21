export function getRoleLabel(role?: number) {
  switch (role) {
    case 1:
      return "System Administrator";
    case 2:
      return "Conference Manager";
    case 3:
      return "Reviewer";
    default:
      return "Administrator";
  }
}
