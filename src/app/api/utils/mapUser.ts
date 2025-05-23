import { ApplicationUser } from "../../Models/User.ts";

export function mapUser(user: ApplicationUser) {
  return {
    id: "",
    normalizedUserName: "",
    email: "",
    normalizedEmail: "",
    emailConfirmed: false,
    concurrencyStamp: "",
    phoneNumber: "",
    phoneNumberConfirmed: false,
    twoFactorEnabled: false,
    lockoutEnd: "",
    lockoutEnabled: false,
    accessFailedCount: 0,
    applicationUser: user,
  };
}
