import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useCreateChannelInWorkspaceMutation } from "../../../../api/workspaces/workspaces.api.ts";
import { visibility } from "../../../../Models/Enums.ts";
import {
  ChannelDto,
  CreateChannelDto,
  useModifyChannelMutation,
} from "../../../../api/channels/channels.api.ts";
import {
  addChannel,
  modifyChannel,
} from "../../../../store/slices/channelSlice.ts";
import { ErrorResponse } from "react-router-dom";

interface CreateChannelPopupProps {
  hide: () => void;
  workspaceId: number;
  channelId?: number;
  onChannelActionDone: () => void;
  channelAction: "create" | "modify";
}

function ChannelActionPopup({
  hide,
  workspaceId,
  channelId,
  onChannelActionDone,
  channelAction,
}: CreateChannelPopupProps) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [inputErrorMessage, setInputErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [channelName, setChannelName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [createChannelRequest] = useCreateChannelInWorkspaceMutation();
  const [modifyChannelRequest] = useModifyChannelMutation();

  const handleCreateChannel = async () => {
    if (!workspaceId) {
      hide();
      return;
    }
    if (!channelName) {
      setInputErrorMessage("You must provide a name for the channel.");
      return;
    }
    setInputErrorMessage(undefined);

    if (channelName.length > 50) {
      setInputErrorMessage("The channel name must be less than 50 characters.");
      return;
    }
    setInputErrorMessage(undefined);

    if (channelAction === "modify") {
      // MODIFY CHANNEL
      const newChannelInfos: Partial<ChannelDto> = {
        id: channelId,
        name: channelName,
        visibility: isPublic ? visibility.public : visibility.private,
      };
      try {
        const modifiedChannel =
          await modifyChannelRequest(newChannelInfos).unwrap();
        dispatch(modifyChannel(modifiedChannel));
        onChannelActionDone();
        hide();
      } catch (e) {
        const error = e as ErrorResponse;
        setErrorMessage(error.data.detail);
        return error;
      }
    } else {
      // CREATE CHANNEL
      const newChannel: CreateChannelDto = {
        name: channelName,
        visibility: isPublic ? visibility.public : visibility.private,
        workspaceId: workspaceId,
      };

      try {
        const createdChannel = await createChannelRequest(newChannel).unwrap();
        dispatch(addChannel(createdChannel));
        onChannelActionDone();
        hide();
      } catch (e) {
        const error = e as ErrorResponse;
        setErrorMessage(error.data.detail);
        return error;
      }
    }
  };

  return (
    <>
      <div className="flex flex-col text-black px-8 py-6 border bg-white border-[#ECECEC] rounded-2xl">
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-xl">
            {channelAction === "create" ? "Create a channel" : "Modify Channel"}
          </p>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <label className="flex" htmlFor="createChannel">
                  Name of the channel
                </label>
                {inputErrorMessage ? (
                  <p className="text-xs text-red-500"> {inputErrorMessage}</p>
                ) : null}
                <InputText
                  name="createChannel"
                  id="createChannel"
                  className="w-full border rounded border-black px-2 py-1"
                  placeholder="Name of the channel"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value ?? "")}
                />
              </div>
              <div className="flex gap-8">
                <div className="flex flex-col gap-2">
                  <p> Public channel </p>
                  <p className="text-black/50">
                    All the members can view and speak in this channel
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="customSwitch"
                  defaultChecked
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {errorMessage ? (
                <p className="text-xs text-red-500 self-end"> {errorMessage}</p>
              ) : null}
              <div className="flex self-end gap-4">
                <button
                  className="flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg"
                  onClick={() => hide()}
                >
                  <i
                    className="pi pi-times"
                    style={{ color: "var(--main-color-500)" }}
                  ></i>
                  <p className="text-[#687BEC]">Cancel</p>
                </button>
                <button
                  className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg"
                  onClick={() => handleCreateChannel()}
                >
                  <i className="pi pi-plus text-white"></i>
                  <p className="text-white">
                    {channelAction === "create"
                      ? "Create the channel"
                      : "Modify the Channel"}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChannelActionPopup;
