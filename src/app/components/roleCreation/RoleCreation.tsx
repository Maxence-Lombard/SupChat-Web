import WorkspaceParametersLayout from "../../layouts/WorkspaceParametersLayout.tsx";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import OptionToggleCard from "../optionToggleCard/OptionToggleCard.tsx";
import {
  createRoleDto,
  useCreateWorkspaceRoleMutation,
  useGetWorkspaceRolesPermissionsQuery,
  useModifyWorkspaceRoleMutation,
} from "../../api/workspaces/workspaces.api.ts";
import { useLocation, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";

const optionsSections = [
  {
    title: "Administrator",
    options: [
      {
        key: "administrator",
        label: "Administrator",
        description: "Users have all the rights.",
        permission: 134,
      },
    ],
  },
  {
    title: "Defaults",
    options: [
      {
        key: "viewChannels",
        label: "View channels",
        description: "Users can view all public channels.",
        permission: 22,
      },
      {
        key: "viewMessages",
        label: "View messages",
        description:
          "Users can read messages in any channel they have access to.",
        permission: 57,
      },
      {
        key: "sendMessages",
        label: "Send messages",
        description:
          "Users can send messages in any channel they have access to.",
        permission: 59,
      },
      {
        key: "viewAttachments",
        label: "View attachments",
        description:
          "Users can view files shared in any channel they have access to.",
        permission: 8,
      },
      {
        key: "sendAttachments",
        label: "Send attachments",
        description: "Users can send files in any channel they have access to.",
        permission: 10,
      },
      {
        key: "viewReactions",
        label: "View reactions",
        description:
          "Users can see emoji reactions in any channel they have access to.",
        permission: 85,
      },
      {
        key: "sendReactions",
        label: "Send reactions",
        description:
          "Users can react to messages with emojis in any channel they have access to.",
        permission: 87,
      },
    ],
  },
  {
    title: "Workspace",
    options: [
      {
        key: "manageWorkspace",
        label: "Manage workspace",
        description: "Users can edit or delete the workspace.",
        permission: 109,
      },
    ],
  },
  {
    title: "Channels",
    options: [
      {
        key: "manageChannels",
        label: "Manage invitations",
        description: "Users can create, edit, or delete channels.",
        permission: [24, 25, 26],
      },
      {
        key: "viewChannelsMembers",
        label: "View channels members",
        description:
          "Users can view all users in any channel they have access to.",
        permission: 29,
      },
      {
        key: "manageChannelsMembers",
        label: "Manage channels members",
        description:
          "Users can add or remove members from any channel they have access to.",
        permission: [31, 32, 33],
      },
    ],
  },
  {
    title: "Messages",
    options: [
      {
        key: "manageMessages",
        label: "Manage messages",
        description:
          "Users can edit or delete messages in any channel they have access to.",
        permission: [60, 61],
      },
    ],
  },
  {
    title: "Attachments",
    options: [
      {
        key: "manageAttachments",
        label: "Manage attachments",
        description:
          "Users can edit or delete files in any channel they have access to.",
        permission: [11, 12],
      },
    ],
  },
  {
    title: "Invitations",
    options: [
      {
        key: "viewInvitations",
        label: "View invitations",
        description:
          "Users can view all pending invitations to join the workspace.",
        permission: 50,
      },
      {
        key: "sendInvitations",
        label: "Send invitations",
        description: "Users can invite others to join the workspace.",
        permission: 52,
      },
      {
        key: "manageInvitations",
        label: "Manage invitations",
        description:
          "Users can edit or delete pending invitations to join the workspace.",
        permission: [53, 54],
      },
    ],
  },
  {
    title: "Roles",
    options: [
      {
        key: "viewRoles",
        label: "View all roles",
        description: "Users can view all roles in the workspace.",
        permission: 127,
      },
      {
        key: "viewUsersRoles",
        label: "View users roles",
        description: "Users can view the assigned roles of other users.",
        permission: 99,
      },
      {
        key: "assignRoles",
        label: "Assign roles",
        description: "Users can assign roles to other users.",
        permission: 101,
      },
      {
        key: "unassignRoles",
        label: "Unassign roles",
        description: "Users can remove roles from other users.",
        permission: 103,
      },
      {
        key: "manageRoles",
        label: "Manage roles",
        description:
          "Users can create, edit, or delete roles in the workspace.",
        permission: [129, 130, 131],
      },
    ],
  },
];

function RoleCreation() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roleId = params.get("roleId");
  const roleName = params.get("roleName");

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [name, setName] = useState(roleName || "");
  const [toggles, setToggles] = useState<{ [key: string]: boolean }>({
    // Administrator permission
    administrator: false,
    // Default permissions
    viewChannels: true,
    viewMessages: true,
    sendMessages: true,
    viewAttachments: true,
    sendAttachments: true,
    viewReactions: true,
    sendReactions: true,
    // Workspace permissions
    manageWorkspace: false,
    // Channels permissions
    manageChannels: false,
    viewChannelsMembers: false,
    manageChannelsMembers: false,
    // Messages permissions
    manageMessages: false,
    // Attachments permissions
    manageAttachments: false,
    // Invitations permissions
    viewInvitations: false,
    sendInvitations: false,
    manageInvitations: false,
    // Roles permissions
    viewRoles: false,
    viewUsersRoles: false,
    assignRoles: false,
    unassignRoles: false,
    manageRoles: false,
  });
  const [inputErrorMessage, setInputErrorMessage] = useState<string>("");

  const { data: rolePermissionsIds } = useGetWorkspaceRolesPermissionsQuery(
    !roleId
      ? skipToken
      : {
          workspaceId: Number(workspaceId),
          roleId: Number(roleId),
        },
  );
  const [createRoleRequest] = useCreateWorkspaceRoleMutation();
  const [modifyRoleRequest] = useModifyWorkspaceRoleMutation();

  const handleToggleChange = (key: string, value: boolean) => {
    setToggles((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const permissionsIds: number[] = [];
  optionsSections.forEach((section) => {
    section.options.forEach((option) => {
      if (toggles[option.key]) {
        if (Array.isArray(option.permission)) {
          permissionsIds.push(...option.permission);
        } else {
          permissionsIds.push(option.permission);
        }
      }
    });
  });

  const handleModifyRole = async () => {
    if (!roleId) {
      console.error("Role ID is required for modification.");
      return;
    }

    const modifiedRole: createRoleDto = {
      name: name,
      hierarchy: 0,
      permissionsIds: permissionsIds,
    };

    try {
      await modifyRoleRequest({
        workspaceId: Number(workspaceId),
        roleId: Number(roleId),
        modifiedRole,
      });
    } catch (error) {
      console.error("Failed to modify role:", error);
    }
  };

  const handleCreateRole = async () => {
    if (!name.trim()) {
      setInputErrorMessage("You must provide a name for the role.");
      return;
    }
    setInputErrorMessage("");

    const newRole: createRoleDto = {
      name: name,
      hierarchy: 0,
      permissionsIds: permissionsIds,
    };
    try {
      const createdRole = await createRoleRequest({
        workspaceId: Number(workspaceId),
        newRole,
      });
    } catch (error) {
      console.error("Failed to create role:", error);
    }
  };

  useEffect(() => {
    if (!rolePermissionsIds) return;

    const permissionIds = rolePermissionsIds.map((p) => p.permissionId);
    const newToggles: { [key: string]: boolean } = { ...toggles };

    optionsSections.forEach((section) => {
      section.options.forEach((option) => {
        if (Array.isArray(option.permission)) {
          newToggles[option.key] = option.permission.some((perm) =>
            permissionIds.includes(perm),
          );
        } else {
          newToggles[option.key] = permissionIds.includes(option.permission);
        }
      });
    });

    setToggles(newToggles);
  }, [rolePermissionsIds]);

  return (
    <WorkspaceParametersLayout
      titleBanner={roleId ? "Role modification" : "Role creation"}
      descriptionBanner={
        roleId
          ? "Modify an existing role to define the permissions of its users in the workspace."
          : "Create a new role for users to define their permissions in the workspace"
      }
    >
      <div className="flex flex-col flex-1 gap-6">
        {roleId ? (
          <div className="flex items-center gap-2">
            <p className="font-semibold text-xl">Modify</p>
            <p className="text-xl text-[var(--main-color-500)]">{roleName}</p>
          </div>
        ) : (
          <p className={"font-semibold text-xl"}> Role creation </p>
        )}
        <div className="flex justify-between">
          <div className="flex w-1/2 flex-col gap-1">
            <label className="flex" htmlFor="name">
              Name
            </label>
            {inputErrorMessage ? (
              <p className="text-xs text-red-500"> {inputErrorMessage}</p>
            ) : null}
            <InputText
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button
            className="flex self-end items-center gap-2 px-4 py-2 rounded-lg text-white bg-[var(--main-color-500)]"
            onClick={roleId ? handleModifyRole : handleCreateRole}
          >
            <i className={roleId ? "pi pi-save" : "pi pi-plus"} />
            <p> {roleId ? "Save changes" : "Create new role"} </p>
          </button>
        </div>
        <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto">
          {toggles.administrator ? (
            <div className="flex flex-col gap-4">
              <p className="font-semibold">{optionsSections[0].title}</p>
              {optionsSections[0].options.map((option) => (
                <OptionToggleCard
                  key={option.key}
                  name={option.label}
                  description={option.description}
                  toggle={toggles[option.key] || false}
                  onToggleChange={(value: boolean) =>
                    handleToggleChange(option.key, value)
                  }
                />
              ))}
            </div>
          ) : (
            optionsSections.map((section, index) => (
              <div key={index} className="flex flex-col gap-4">
                <p className="font-semibold">{section.title}</p>
                {section.options.map((option) => (
                  <OptionToggleCard
                    key={option.key}
                    name={option.label}
                    description={option.description}
                    toggle={toggles[option.key] || false}
                    onToggleChange={(value: boolean) =>
                      handleToggleChange(option.key, value)
                    }
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </WorkspaceParametersLayout>
  );
}

export default RoleCreation;
