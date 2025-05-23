import { useSelector } from "react-redux";
import useUserProfilePicture from "../../../hooks/useUserProfilePicture";
import { useDateFormatter } from "../../../hooks/useDateFormatter.tsx";
import { RootState } from "../../../store/store.ts";
import { Message } from "../../../api/messages/messages.api.ts";

type MessageProps = {
  message: Message;
  currentUserId: number;
  currentUserImage: string;
};

function MessageItem({
  message,
  currentUserId,
  currentUserImage,
}: MessageProps) {
  const user = useSelector(
    (state: RootState) => state.users.byId[message.senderId],
  );
  const userImage = useUserProfilePicture(
    user?.applicationUser?.profilePictureId || "",
  );
  const { formatDate } = useDateFormatter();

  if (message.senderId === currentUserId) {
    return (
      <div className="flex justify-end items-end w-full gap-3" key={message.id}>
        <div className="flex flex-col gap-1 items-end">
          <p className="text-black/50">
            {formatDate(message.sendDate, "HH'h'mm")}
          </p>
          <div className="flex bg-[#687BEC] rounded-lg px-2 max-w-xl">
            <p className="text-white">{message.content}</p>
          </div>
        </div>
        <img
          src={currentUserImage}
          alt="currentUserImage"
          className="w-14 h-14 rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3" key={message.id}>
      <img src={userImage} alt="userImage" className="w-14 h-14 rounded-lg" />
      <div className="flex flex-col gap-1">
        <p className="text-black/50">
          {formatDate(message.sendDate, "HH'h'mm")}
        </p>
        <div className="flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl">
          <p className="text-black">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
