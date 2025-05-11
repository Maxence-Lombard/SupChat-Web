import {status, theme} from "./Enums.ts";

export interface UserInitialState {
    id?: number;
    firstName?: string;
    lastName?: string,
    image?: string,
    status?: status;
    statusLocalized?: string,
    theme?: theme,
    themeLocalized?: string,
    language?: string,
    languageLocalized?: string
}

export interface User {
    id: number;
    firstName: string;
    lastName: string,
    image: string,
    status: status;
    statusLocalized: string,
    theme: theme,
    themeLocalized: string,
    language: string,
    languageLocalized: string
}

export interface UserProps {
    user: {
        id: number;
        firstName: string;
        status: status;
    }
}