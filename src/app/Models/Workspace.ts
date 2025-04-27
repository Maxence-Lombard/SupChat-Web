import {visibility} from "./Visibility.ts";

export interface WORKSPACE {
    id: number;
    name: string,
    image: string,
    visibility: visibility,
    createdAt: Date;
    updatedAt: Date;
}