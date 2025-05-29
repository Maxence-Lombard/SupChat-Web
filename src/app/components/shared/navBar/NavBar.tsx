import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import NewWorkspaceActionsPopup from "../popups/newWorkSpaceActions/NewWorkspaceActionsPopup.tsx";
import CreateWorkspacePopup from "../popups/createWorkspace/CreateWorkspacePopup.tsx";
import { useAuth } from "../../../hooks/useAuth.tsx";
import { useGetFirstChannelMutation } from "../../../api/workspaces/workspaces.api.ts";
import { useDownloadFileMutation } from "../../../api/attachments/attachments.api.ts";
import { setProfilePicture } from "../../../store/slices/profilePictureSlice.ts";
import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import useProfilePicture from "../../../hooks/useProfilePicture.tsx";

function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const workspaces = useSelector((state: RootState) => state.workspaces.list);
  const profilePictureUrls = useSelector(
    (state: RootState) => state.profilePictures,
  );
  const userProfilePictureId = useSelector(
    (state: RootState) =>
      state.users.byId[state.users.currentUserId!]?.profilePictureId,
  );
  const username = useSelector(
    (state: RootState) =>
      state.users.byId[state.users.currentUserId!]?.firstName,
  );

  const userImage = useProfilePicture(userProfilePictureId);

  const [newWorkspaceVisible, setNewWorkspaceVisible] =
    useState<boolean>(false);
  const [createWorkspaceVisible, setCreateWorkspaceVisible] =
    useState<boolean>(false);

  const [workspaceImages, setWorkspaceImages] = useState<{
    [id: number]: string;
  }>({});

  const { logout } = useAuth();
  const [GetProfilePicture] = useDownloadFileMutation();
  const [GetFirstChannel] = useGetFirstChannelMutation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = (nav: string) => {
    switch (nav) {
      case "messages":
        navigate(`/`);
        break;
      case "activities":
        navigate(`/`);
        break;
      case "settings":
        navigate(`/`);
        break;
      default:
        break;
    }
  };
  const navigateToWorkspace = async (id: number) => {
    try {
      const channel = await GetFirstChannel(id).unwrap();
      navigate(`/workspace/${channel.workspaceId}/channel/${channel.id}`);
    } catch (error) {
      console.error("Error fetching first channel:", error);
    }
  };

  const setWorkspaceProfilePicture = async () => {
    const images: { [id: number]: string } = {};
    for (const workspace of workspaces) {
      const workspacePPId = workspace.profilePictureId || undefined;
      if (workspacePPId && profilePictureUrls[workspacePPId]) {
        images[workspace.id] = profilePictureUrls[workspacePPId];
      } else if (workspacePPId) {
        try {
          const blob = await GetProfilePicture(workspacePPId).unwrap();
          const url = URL.createObjectURL(blob);
          images[workspace.id] = url;
          dispatch(setProfilePicture({ id: workspacePPId, url }));
          setWorkspaceImages(images);
        } catch (error) {
          return error;
        }
      }
    }
    setWorkspaceImages(images);
  };

  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      setWorkspaceProfilePicture();
    }
  }, [workspaces]);

  return (
    <>
      <div className="flex flex-col justify-between items-center w-28 h-full px-4 py-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-4">
            <i
              className="pi pi-inbox text-2xl cursor-pointer"
              onClick={() => handleNavigation("messages")}
            />
            <i className="pi pi-bell text-2xl cursor-pointer" />
            <i className="pi pi-cog text-2xl  cursor-pointer" />
          </div>
          <hr className="w-full border border-black/50 " />
          {/* TODO: régler pb de liste workspace pas scrollable */}
          <div className="flex flex-col items-center gap-4 h-full overflow-y-auto">
            {workspaces?.map((workspace) => (
              <ProfilePictureAvatar
                key={workspace.id}
                avatarType={"workspace"}
                url={workspaceImages[workspace.id]}
                action={() => navigateToWorkspace(workspace.id)}
                altText={workspace.name.charAt(0).toUpperCase()}
              />
            ))}
            <button
              onClick={() => setNewWorkspaceVisible(true)}
              className="flex items-center justify-center w-12 h-12 bg-white border border-[#ECECEC] rounded-lg"
            >
              <i className="pi pi-plus" />
            </button>
            {/* New workspace */}
            <Dialog
              className="rounded-2xl"
              visible={newWorkspaceVisible}
              modal
              onHide={() => {
                if (!newWorkspaceVisible) return;
                setNewWorkspaceVisible(false);
              }}
              content={({ hide }) => (
                <NewWorkspaceActionsPopup
                  hide={() => hide()}
                  onClose={(action?: string) => {
                    setNewWorkspaceVisible(false);
                    if (action === "create") {
                      setCreateWorkspaceVisible(true);
                    }
                  }}
                />
              )}
            ></Dialog>
            {/* Create workspace */}
            <Dialog
              className="rounded-2xl"
              visible={createWorkspaceVisible}
              modal
              onHide={() => {
                if (!createWorkspaceVisible) return;
                setCreateWorkspaceVisible(false);
              }}
              content={({ hide }) => (
                <CreateWorkspacePopup
                  hide={hide}
                  onWorkspaceCreated={() => {
                    setCreateWorkspaceVisible(false);
                  }}
                />
              )}
            ></Dialog>
          </div>
        </div>
        <div>
          <ProfilePictureAvatar
            avatarType={"user"}
            url={userImage}
            altText={username?.charAt(0).toUpperCase()}
          />
          <i
            className="pi pi-sign-out text-2xl text-red-500"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
}

export default NavBar;
