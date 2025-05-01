import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetWorkspaceResponse} from "../../api/workspaces/workspaces.api.ts";

interface WorkspaceState {
    list: GetWorkspaceResponse[];
}
const initialState: WorkspaceState = {
    list: [],
};

export const workspacesSlice = createSlice({
    name: 'workspace',
    initialState: initialState,
    reducers: {
        setWorkspaces: (state, action: PayloadAction<GetWorkspaceResponse[]>) => {
            state.list = action.payload;
        }
    },
})

export const { setWorkspaces } = workspacesSlice.actions;
export default workspacesSlice.reducer;