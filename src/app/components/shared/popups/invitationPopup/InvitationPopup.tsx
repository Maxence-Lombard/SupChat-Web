import CheckUserCard from "../../checkUserCard/CheckUserCard.tsx";
import { useEffect, useState } from "react";
import {
  useCreateWorkspaceInvitationMutation,
  useGetWorkspaceNonMembersQuery,
  useSendWorkspaceInvitationByEmailMutation,
} from "../../../../api/workspaces/workspaces.api.ts";
import { ErrorResponse } from "../../../../Models/Error.ts";

interface DeletePopupProps {
  workspaceId: number;
  hide: () => void;
}

function InvitationPopup({ workspaceId, hide }: DeletePopupProps) {
  const { data: users } = useGetWorkspaceNonMembersQuery({
    workspaceId: workspaceId,
    pageNumber: 1,
    pageSize: 20,
  });
  const [invitationLinkRequest] = useCreateWorkspaceInvitationMutation();
  const [sendInvitationsByEmailRequest] =
    useSendWorkspaceInvitationByEmailMutation();

  const [usersId, setUsersId] = useState<number[]>([]);
  const [invitationLink, setInvitationLink] = useState<string | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined,
  );

  const handleCopyInvitation = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
    }
  };

  const handleSendInvitations = () => {
    if (usersId.length > 0) {
      for (const userId of usersId) {
        sendInvitationsByEmailRequest({
          workspaceId: workspaceId,
          userId: userId,
        })
          .unwrap()
          .then(() => {
            setSuccessMessage("Invitations sent successfully");
            setTimeout(() => {
              setSuccessMessage(undefined);
              hide();
            }, 3000);
          })
          .catch((e) => {
            const error = e as ErrorResponse;
            setErrorMessage(error.data.detail);
            setTimeout(() => {
              setErrorMessage(undefined);
            }, 3000);
            return error;
          });
      }
    } else {
      setErrorMessage("Please select at least one user to invite");
      setTimeout(() => {
        setErrorMessage(undefined);
      }, 3000);
    }
  };

  const generateInvitationLink = async () => {
    try {
      const response = await invitationLinkRequest(workspaceId).unwrap();
      setInvitationLink(response);
    } catch (e) {
      console.log("Error generating invitation link:", e);
      return e;
    }
  };

  useEffect(() => {
    if (workspaceId && !invitationLink) {
      generateInvitationLink();
    }
  }, [workspaceId, invitationLink]);

  return (
    <>
      <div className="flex flex-col gap-6 text-left text-black p-4 border bg-white border-[#ECECEC] rounded-2xl">
        <p className="font-semibold text-xl"> Send invitation </p>
        <div className="flex gap-4 bg-[var(--main-color-500)] p-2 rounded-lg items-center">
          <i className="pi pi-send text-white text-xl" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white">
              <p> {invitationLink} </p>
              <i
                className="pi pi-copy cursor-pointer"
                onClick={handleCopyInvitation}
              />
            </div>
            <p className="text-sm text-white/75">
              Copy and share this link to invite someone to your workspace
            </p>
          </div>
        </div>
        <p className="text-black/50"> or send an invitation by mail </p>
        <div className="flex flex-col gap-2 max-h-[800px] overflow-y-auto">
          {!users
            ? null
            : users.map((user) => (
                <CheckUserCard
                  key={user.id}
                  user={{
                    id: user.id,
                    username: user.username,
                    profilePictureId: user.profilePictureId,
                  }}
                  checked={usersId.includes(user.id)}
                  onChange={() => {
                    setUsersId((prev) =>
                      prev.includes(user.id)
                        ? prev.filter((id) => id !== user.id)
                        : [...prev, user.id],
                    );
                  }}
                />
              ))}
        </div>
        <div className="flex flex-col gap-1 text-right">
          {errorMessage ? (
            <p className="text-xs text-red-500">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="text-xs text-green-600">{successMessage}</p>
          ) : null}
          <div className="flex self-end gap-2">
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
              onClick={() => handleSendInvitations()}
            >
              <i className="pi pi-send text-white"></i>
              <p className="text-white">Send invitations</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvitationPopup;
