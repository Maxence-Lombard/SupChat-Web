import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  GetWorkspaceResponse,
  WorkspaceDto,
} from "../../api/workspaces/workspaces.api.ts";

interface WorkspaceState {
  list: GetWorkspaceResponse[];
}

const initialState: WorkspaceState = {
  list: [],
};

export const workspacesSlice = createSlice({
  name: "workspace",
  initialState: initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<GetWorkspaceResponse>) => {
      state.list.push(action.payload);
    },
    setWorkspaces: (state, action: PayloadAction<GetWorkspaceResponse[]>) => {
      state.list = action.payload;
    },
    modifyWorkspaceData: (state, action: PayloadAction<WorkspaceDto>) => {
      const index = state.list.findIndex(
        (workspace) => workspace.id === action.payload.id,
      );
      if (index !== -1) {
        state.list[index] = {
          ...state.list[index],
          ...action.payload,
        };
      }
    },
    removeWorkspace: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(
        (workspace) => workspace.id !== action.payload,
      );
    },
  },
});

export const {
  addWorkspace,
  setWorkspaces,
  modifyWorkspaceData,
  removeWorkspace,
} = workspacesSlice.actions;
export default workspacesSlice.reducer;
