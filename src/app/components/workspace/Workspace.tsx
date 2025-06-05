// ASSETS
import user from "../../../assets/placeholder/user4.svg";
import channelMainColor from "../../../assets/icons/main-color/channel.svg";
import channelIcon from "../../../assets/icons/channel.svg";
import { AvatarGroup } from "primereact/avatargroup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import {
  useGetChannelsByWorkspaceIdQuery,
  useGetWorkspaceByIdQuery,
} from "../../api/workspaces/workspaces.api.ts";
import { Dialog } from "primereact/dialog";
import ChannelActionPopup from "../shared/popups/channelActionPopup/ChannelActionPopup.tsx";
import { useDispatch, useSelector } from "react-redux";
import { addChannel, deleteChannel } from "../../store/slices/channelSlice.ts";
import { RootState } from "../../store/store.ts";
import {
  useDeleteChannelMutation,
  useGetChannelByIdQuery,
} from "../../api/channels/channels.api.ts";
import useProfilePicture from "../../hooks/useProfilePicture.tsx";
import ProfilePictureAvatar from "../shared/profilePictureAvatar/ProfilePictureAvatar.tsx";
import DeletePopup from "../shared/popups/deletePopup/DeletePopup.tsx";
import Conversation from "../conversation/Conversation.tsx";

function Workspace() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { workspaceId } = useParams();
  const { channelId } = useParams();
  const [search, setSearch] = useState<string>("");
  const [createChannelVisible, setCreateChannelVisibleVisible] =
    useState<boolean>(false);
  const [modifyChannelVisible, setModifyChannelVisible] =
    useState<boolean>(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState<boolean>(false);
  const [currentChannelId, setCurrentChannelId] = useState<number>(
    Number(channelId),
  );
  const [fetchChannelInfo, setFetchChannelInfo] = useState<boolean>(false);

  const channelsFromStore = useSelector(
    (state: RootState) => state.channels.byWorkspaceId,
  );
  const userId = useSelector((state: RootState) => state.users.currentUserId);
  const workspaceChannels = Object.values(channelsFromStore).filter(
    (channel) => channel.workspaceId === Number(workspaceId),
  );
  const profilePictureUrls = useSelector(
    (state: RootState) => state.profilePictures,
  );

  const skipChannels = workspaceChannels.length > 0;
  const skipFetchChannelInfo = fetchChannelInfo;

  const { data: workspace } = useGetWorkspaceByIdQuery(Number(workspaceId));
  const { data: channels, isSuccess } = useGetChannelsByWorkspaceIdQuery(
    Number(workspaceId),
    { skip: skipChannels },
  );
  const { data: channelInfo } = useGetChannelByIdQuery(
    Number(currentChannelId),
    { skip: skipFetchChannelInfo },
  );
  const [deleteChannelRequest] = useDeleteChannelMutation();

  const workspaceProfilePicture = useProfilePicture(
    workspace?.profilePictureId ?? "",
  );

  useEffect(() => {
    if (isSuccess && channels) {
      channels.forEach((channel) => {
        dispatch(addChannel(channel));
      });
    }
  }, [isSuccess, channels, dispatch, workspace, profilePictureUrls]);

  const handleChannelNavigate = (channelId: number) => {
    setCurrentChannelId(channelId);
    navigate(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const handleWorkspaceParametersNavigate = (workspaceId: number) => {
    navigate(`/workspace/settings/${workspaceId}`);
  };

  return (
    <>
      <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
        <div className="flex flex-col gap-8 w-[240px]">
          <div className="flex items-center gap-1 p-2 w-full border rounded-lg border-black">
            <i className="pi pi-search text-[#505050]/50"></i>
            <input
              className="bg-white focus:outline-none w-full"
              name="search"
              id="firstname"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value ?? "")}
            />
          </div>
          <div className="flex flex-col p-2 gap-6 h-full overflow-y-auto bg-[#EBEBEB]/50 rounded-lg">
            <div className="flex gap-3">
              <ProfilePictureAvatar
                avatarType={"workspace"}
                url={workspaceProfilePicture}
                altText={workspace?.name.charAt(0).toUpperCase() || "?"}
              />
              <div className="flex flex-col h-full gap-auto">
                <p className="font-semibold"> {workspace?.name} </p>
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() =>
                    handleWorkspaceParametersNavigate(Number(workspaceId))
                  }
                >
                  {userId === workspace?.ownerId ? (
                    <>
                      <p className="text-black/50">Settings</p>
                      <i className="pi pi-cog text-black/50" />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <hr className="w-full border border-[#EBEBEB]" />
            <div className="flex flex-col gap-6">
              {/* LIST OF CHANNELS */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex flex-col h-full items-center gap-4">
                    <img
                      className="w-6 h-6 rounded-lg"
                      src={channelMainColor}
                      alt="channelMainColor"
                    />
                    <div className="w-[1px] h-full rounded-lg bg-black"></div>
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex gap-3">
                      <p className="font-semibold text-[#6B8AFD]">Channels</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {workspaceChannels?.map((channel) => (
                        <div
                          className="flex items-center gap-1 cursor-pointer group"
                          key={channel.id}
                          onClick={() => handleChannelNavigate(channel.id)}
                        >
                          <div className="flex items-center gap-1">
                            <img
                              className="w-6 h-6"
                              src={channelIcon}
                              alt="channelIcon"
                            />
                            <p className="max-w-full truncate">
                              {channel.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <i
                              className="pi pi-pencil text-black/50 cursor-pointer"
                              onClick={() => {
                                setCurrentChannelId(channel.id);
                                setModifyChannelVisible(true);
                              }}
                            />
                            <i
                              className="pi pi-trash cursor-pointer text-red-500"
                              onClick={() => {
                                setCurrentChannelId(channel.id);
                                setDeleteConfirmationVisible(true);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 ml-1 cursor-pointer"
                  onClick={() => setCreateChannelVisibleVisible(true)}
                >
                  <i
                    className="pi pi-plus-circle"
                    style={{ color: "var(--main-color-500)" }}
                  />
                  <p>Add Channel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          {/* WORKSPACE BANNER */}
          <div className="flex mb-8 w-full items-center justify-between border border-[#ECECEC] rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2">
              <ProfilePictureAvatar
                avatarType={"workspace"}
                url={workspaceProfilePicture}
                altText={workspace?.name.charAt(0).toUpperCase() || "?"}
              />
              <div>
                <p className="font-semibold">
                  {workspace?.name} - {channelInfo?.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-black/50 text-xs"> 5 members </p>
                  <div className="w-1 h-1 bg-[#D9D9D9] rounded-full"></div>
                  <p className="text-[#00A000] text-xs"> 2 online </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 h-full py-1">
              <div className="flex items-center gap-2">
                <AvatarGroup>
                  <Avatar
                    image={user}
                    size="large"
                    shape="square"
                    className="rounded-lg"
                  />
                  <Avatar
                    image={user}
                    size="large"
                    shape="square"
                    className="rounded-lg"
                  />
                  <Avatar
                    image={user}
                    size="large"
                    shape="square"
                    className="rounded-lg"
                  />
                  <Avatar
                    label="+2"
                    shape="square"
                    size="large"
                    className="bg-[#6B8AFD] text-white rounded-lg"
                  />
                </AvatarGroup>
              </div>
              <div className="w-[1px] h-full rounded-lg bg-[#ECECEC]"></div>
              <div className="flex items-center gap-6">
                <i
                  className="pi pi-search text-xl cursor-pointer"
                  style={{ color: "var(--main-color-500)" }}
                />
                <i
                  className="pi pi-info-circle text-xl cursor-pointer"
                  style={{ color: "var(--main-color-500)" }}
                />
                <i
                  className="pi pi-ellipsis-v text-xl cursor-pointer"
                  style={{ color: "var(--main-color-500)" }}
                />
              </div>
            </div>
          </div>
          {/* CHANNEL CONVERSATION */}
          <Conversation />
        </div>
      </div>
      {/* MODIFY CHANNEL POPUP */}
      <Dialog
        className="rounded-2xl"
        visible={modifyChannelVisible}
        modal
        onHide={() => {
          if (!modifyChannelVisible) return;
          setModifyChannelVisible(false);
        }}
        content={({ hide }) => (
          <ChannelActionPopup
            hide={hide}
            workspaceId={Number(workspaceId)}
            channelId={currentChannelId}
            onChannelActionDone={() => {
              setModifyChannelVisible(false);
            }}
            channelAction="modify"
          />
        )}
      ></Dialog>
      {/* CREATE CHANNEL POPUP */}
      <Dialog
        className="rounded-2xl"
        visible={createChannelVisible}
        modal
        onHide={() => {
          if (!createChannelVisible) return;
          setCreateChannelVisibleVisible(false);
        }}
        content={({ hide }) => (
          <ChannelActionPopup
            hide={hide}
            workspaceId={Number(workspaceId)}
            onChannelActionDone={() => {
              setCreateChannelVisibleVisible(false);
            }}
            channelAction="create"
          />
        )}
      ></Dialog>
      {/* CONFIRM DELETE POPUP */}
      <Dialog
        className="rounded-2xl"
        visible={deleteConfirmationVisible}
        modal
        onHide={() => {
          if (!deleteConfirmationVisible) return;
          setDeleteConfirmationVisible(false);
        }}
        content={({ hide }) => (
          <DeletePopup
            itemToDelete={"channel"}
            deleteAction={async () => {
              await deleteChannelRequest(Number(currentChannelId));
              setDeleteConfirmationVisible(false);
              dispatch(deleteChannel(currentChannelId));
              hide();
            }}
            hide={hide}
          />
        )}
      ></Dialog>
    </>
  );
}

export default Workspace;
