import { status, theme } from "./Enums.ts";

export interface UserInitialState {
  id?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed?: boolean;
  concurrencyStamp?: string;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  applicationUser: ApplicationUserInitialState;
}

export interface ApplicationUserInitialState {
  id?: number;
  firstName?: string;
  lastName?: string;
  image?: string;
  status?: status;
  statusLocalized?: string;
  theme?: theme;
  themeLocalized?: string;
  language?: string;
  languageLocalized?: string;
  profilePictureId?: string;
}

export interface ApplicationUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  image: string;
  status: status;
  statusLocalized: string;
  theme: theme;
  themeLocalized: string;
  language: string;
  languageLocalized: string;
  profilePictureId?: string;
}

export interface User {
  id: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  applicationUser: ApplicationUser;
}

export interface UserProps {
  user: ApplicationUser;
}
