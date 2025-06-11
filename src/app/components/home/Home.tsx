import ShortInfoUserCard from "../shared/short-info-user-card/ShortInfoUserCard.tsx";
import DiscussionsListing from "../shared/discussions-listing/DiscussionsListing.tsx";
import { useGetUserWithMessagesQuery } from "../../api/user/user.api.ts";
import { status } from "../../Models/Enums.ts";
import {
  useGetNotificationByUserQuery,
  useReadAllNotificationMutation,
} from "../../api/notifications/notifications.api.ts";
import { RootState } from "../../store/store.ts";
import { useSelector } from "react-redux";
import NotificationCard from "../shared/notificationCard/NotificationCard.tsx";

function Home() {
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUserId,
  );

  const { data: users } = useGetUserWithMessagesQuery(undefined);
  const { data: notifications } = useGetNotificationByUserQuery(
    currentUserId!,
    { skip: !currentUserId },
  );
  const [readAllNotifications] = useReadAllNotificationMutation();

  return (
    <>
      <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
        <DiscussionsListing />
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center px-4 py-2 border rounded-lg border-[#ECECEC]">
              <p> Users connected </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {users
              ?.filter((user) => user.status === status.online)
              .map((user) => <ShortInfoUserCard user={user} key={user.id} />)}
          </div>
        </div>
        {notifications && notifications.length > 0 ? (
          <div className="flex flex-col gap-4 h-full overflow-y-auto">
            <p
              className="text-[var(--main-color-500)] cursor-pointer"
              onClick={() =>
                readAllNotifications(
                  notifications?.map((notif) => notif.id) || [],
                )
              }
            >
              Clear all
            </p>
            {notifications?.map((notif, index) => (
              <NotificationCard key={index} notif={notif} />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Home;
