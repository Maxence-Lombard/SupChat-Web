import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = {
  id: number;
  name: string;
  hierarchy: number;
  workspaceId: number;
  memberCount?: number;
  permissionsIds?: number[];
};

type RoleState = {
  byWorkspaceId: Record<number, Role[]>;
};

const initialState: RoleState = {
  byWorkspaceId: {},
};

const roleSlice = createSlice({
  name: "roles",
  initialState: initialState,
  reducers: {
    setRolesForWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: number; roles: Role[] }>,
    ) => {
      state.byWorkspaceId[action.payload.workspaceId] = action.payload.roles;
    },
    setRolePermissions: (
      state,
      action: PayloadAction<{
        workspaceId: number;
        roleId: number;
        permissionsIds: number[];
      }>,
    ) => {
      const roles = state.byWorkspaceId[action.payload.workspaceId];
      if (roles) {
        const role = roles.find((r) => r.id === action.payload.roleId);
        if (role) {
          role.permissionsIds = action.payload.permissionsIds;
        }
      }
    },
    setRoleMemberCount: (
      state,
      action: PayloadAction<{
        workspaceId: number;
        roleId: number;
        memberCount: number;
      }>,
    ) => {
      const roles = state.byWorkspaceId[action.payload.workspaceId];
      if (roles) {
        const role = roles.find((r) => r.id === action.payload.roleId);
        if (role) {
          role.memberCount = action.payload.memberCount;
        }
      }
    },
    addRole: (
      state,
      action: PayloadAction<{ workspaceId: number; role: Role }>,
    ) => {
      const { workspaceId, role } = action.payload;
      if (!state.byWorkspaceId[workspaceId]) {
        state.byWorkspaceId[workspaceId] = [];
      }
      state.byWorkspaceId[workspaceId].push({
        ...role,
        memberCount: role.memberCount ?? 0,
      });
    },
    updateRole: (
      state,
      action: PayloadAction<{ workspaceId: number; role: Role }>,
    ) => {
      const { workspaceId, role } = action.payload;
      const roles = state.byWorkspaceId[workspaceId];
      if (roles) {
        const idx = roles.findIndex((r) => r.id === role.id);
        if (idx !== -1) {
          roles[idx] = role;
        }
      }
    },
    deleteRole: (
      state,
      action: PayloadAction<{ workspaceId: number; roleId: number }>,
    ) => {
      const { workspaceId, roleId } = action.payload;
      const roles = state.byWorkspaceId[workspaceId];
      if (roles) {
        state.byWorkspaceId[workspaceId] = roles.filter((r) => r.id !== roleId);
      }
    },
    clearRoles: () => initialState,
  },
});

export const {
  setRolesForWorkspace,
  setRolePermissions,
  setRoleMemberCount,
  addRole,
  updateRole,
  deleteRole,
  clearRoles,
} = roleSlice.actions;

export default roleSlice.reducer;
