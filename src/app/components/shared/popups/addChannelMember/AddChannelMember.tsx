import CheckUserCard from "../../checkUserCard/CheckUserCard.tsx";
import { useState } from "react";
import {
  useAddMembersInChannelMutation,
  useGetChannelNotMembersQuery,
} from "../../../../api/channels/channels.api.ts";
import { ErrorResponse } from "../../../../Models/Error.ts";

interface AddChannelMemberProps {
  hide: () => void;
  channelId: number;
  channelName: string;
}

function AddChannelMember({
  hide,
  channelId,
  channelName,
}: AddChannelMemberProps) {
  const [usersId, setUsersId] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined,
  );

  const [addMembersInChannel] = useAddMembersInChannelMutation();
  const { data: notChannelMembers } = useGetChannelNotMembersQuery({
    channelId: channelId,
    pageNumber: 1,
    pageSize: 15,
  });

  const handleAddMembers = async () => {
    if (!usersId || usersId.length === 0) {
      setErrorMessage("You must select at least one member to add.");
      return;
    }
    setErrorMessage(undefined);
    try {
      await addMembersInChannel({ channelId: channelId, usersId: usersId })
        .unwrap()
        .then(() => {
          setSuccessMessage("Members added successfully");
          setTimeout(() => {
            hide();
          }, 2000);
        });
    } catch (e) {
      const error = e as ErrorResponse;
      setErrorMessage(error.data.detail);
      return error;
    }
  };

  return (
    <div className="flex flex-col text-black px-8 py-6 border bg-white border-[#ECECEC] rounded-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <p className="font-semibold text-xl"> Add members to the channel </p>
          <p className="font-semibold text-xl text-[var(--main-color-500)]">
            {channelName}
          </p>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
            {!notChannelMembers || notChannelMembers.length === 0 ? (
              <p className="text-black/50">
                No members available to add in this channel.
              </p>
            ) : (
              notChannelMembers?.map((member, index) => (
                <CheckUserCard
                  key={index}
                  user={{
                    id: member.id,
                    username: member.username,
                    profilePictureId: member.profilePictureId,
                  }}
                  checked={usersId.includes(member.id)}
                  onChange={() => {
                    setUsersId((prev) =>
                      prev.includes(member.id)
                        ? prev.filter((id) => id !== member.id)
                        : [...prev, member.id],
                    );
                  }}
                />
              ))
            )}
          </div>
          <div className="flex flex-col gap-1">
            {errorMessage ? (
              <p className="text-xs text-right text-red-500">{errorMessage}</p>
            ) : null}
            {successMessage ? (
              <p className="text-xs text-right text-green-600">
                {successMessage}
              </p>
            ) : null}
            <div className="flex self-end gap-2">
              {!notChannelMembers || notChannelMembers.length === 0 ? (
                <button
                  className="flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg"
                  onClick={() => hide()}
                >
                  <i
                    className="pi pi-times"
                    style={{ color: "var(--main-color-500)" }}
                  ></i>
                  <p className="text-[#687BEC]"> Close </p>
                </button>
              ) : (
                <>
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
                    onClick={() => handleAddMembers()}
                  >
                    <i className="pi pi-plus text-white"></i>
                    <p className="text-white">Add members</p>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddChannelMember;
