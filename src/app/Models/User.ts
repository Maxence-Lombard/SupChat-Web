import {status} from "./Enums.ts";

export interface User {
    id: number;
    firstName: string;
    status: status;
}

export interface UserProps {
    user: {
        id: number;
        firstName: string;
        status: status;
    }
}