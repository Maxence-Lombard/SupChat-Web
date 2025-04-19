export enum visibility {
    "Public" = 0,
    "Private" = 1,
}

export interface WORKSPACE {
    id: number;
    name: string,
    image: string,
    visibility: visibility,
    createdAt: Date;
    updatedAt: Date;
}