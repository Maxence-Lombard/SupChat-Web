import ShortInfoUserCard from "../shared/short-info-user-card/ShortInfoUserCard.tsx";
import DiscussionsListing from "../shared/discussions-listing/DiscussionsListing.tsx";
import { useGetUserWithMessagesQuery } from "../../api/user/user.api.ts";
import { status } from "../../Models/Enums.ts";

function Home() {
  //TODO: à supprimer lorsque liste conv dans le store
  const { data: users } = useGetUserWithMessagesQuery(undefined);

  return (
    <>
      <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
        <DiscussionsListing />
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center px-4 py-2 border rounded-lg border-[#ECECEC]">
              <p>Conversations actives - 18</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {users
              ?.filter((user) => user.status === status.online)
              .map((user) => <ShortInfoUserCard user={user} key={user.id} />)}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
