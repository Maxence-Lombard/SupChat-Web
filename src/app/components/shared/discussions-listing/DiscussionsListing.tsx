import UserCard from "../userCard/UserCard.tsx";
import { useEffect, useState } from "react";
import { addUser } from "../../../store/slices/usersSlice.ts";
import { useDispatch } from "react-redux";
import {
  useGetAllUsersInfosQuery,
  useGetUserWithMessagesQuery,
} from "../../../api/user/user.api.ts";
import { useDebounce } from "use-debounce";
import { ApplicationUser } from "../../../Models/User.ts";
import { useNavigate } from "react-router-dom";

function DiscussionsListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [filteredUsers, setFilteredUsers] = useState<ApplicationUser[]>([]);
  const [openQuickSearch, setOpenQuickSearch] = useState<boolean>(false);

  const { data: allUsers } = useGetAllUsersInfosQuery({});
  const { data: users } = useGetUserWithMessagesQuery(undefined);

  useEffect(() => {
    if (users) {
      for (const user of users) {
        dispatch(addUser(user));
      }
    }
  }, [users]);

  useEffect(() => {
    if (!allUsers) return;
    const usersWithMessagesIds = users?.map((u) => u.id) ?? [];
    const filtered = allUsers
      .filter((user) => !usersWithMessagesIds.includes(user.id))
      .filter((user) =>
        user.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    setFilteredUsers(filtered);
    console.log("Filtered Users: ", filtered);
  }, [allUsers, users, debouncedSearch]);

  const handleNavigation = (user: ApplicationUser) => {
    navigate(`/privateMessage/${user.id}`, {
      state: {
        user: user,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-8 min-w-[231px]">
        <div className="relative">
          <div className="flex items-center gap-1 p-2 w-full border rounded-lg border-black">
            <i className="pi pi-search text-[#505050]/50"></i>
            <input
              className="bg-white focus:outline-none w-full"
              name="search"
              id="firstname"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value ?? "")}
              onFocus={() => setOpenQuickSearch(true)}
              onBlur={() => setOpenQuickSearch(false)}
            />
          </div>
          {debouncedSearch.trim() !== "" &&
          openQuickSearch &&
          filteredUsers.length > 0 ? (
            <div className="absolute top-full left-0 z-50 mt-2 w-full flex flex-col gap-2 p-2 rounded-lg border border-[#ECECEC] bg-white max-h-[480px] overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className="appearance-none bg-transparent border-none p-0 m-0 shadow-none focus:outline-none"
                  onMouseDown={() => handleNavigation(user)}
                >
                  <UserCard user={user} imageSize={"large"} />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-5 h-full overflow-y-auto">
          {users?.map((user) => <UserCard user={user} key={user.id} />)}
        </div>
      </div>
    </>
  );
}

export default DiscussionsListing;
