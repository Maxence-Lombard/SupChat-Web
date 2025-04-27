import searchIcon from "../../../../assets/icons/search.svg";
import UserCard from "../userCard/UserCard.tsx";
import {useEffect, useState} from "react";
import {useGetUserWithMessagesQuery} from "../../../api/user/user.api.ts";

function DiscussionsListing() {
    const [search, setSearch] = useState<string>('');

    const { data: users, error } = useGetUserWithMessagesQuery(undefined);
    useEffect(() => {
        console.log('Fetched users:', users);
        if (users) {
            console.log('Fetched users:', users);
        }
        if (error) {
            console.error('Error fetching users:', error);
        }
    }, [users, error]);

    return (
        <>
            <div className='flex flex-col gap-8 min-w-[231px]'>
                <div className='flex gap-1 p-2 w-full border rounded-lg border-black'>
                    <img
                        className='w-6 h-6'
                        src={searchIcon}
                        alt="search"
                    />
                    <input
                        className='bg-white focus:outline-none w-full'
                        name="search"
                        id="firstname"
                        placeholder='Search'
                        value={search} onChange={(e) => setSearch(e.target.value ?? '')}
                    />
                </div>
                <div className='flex flex-col gap-5 h-full overflow-y-auto'>
                    { users?.map(user =>(
                        <UserCard user={user} key={user.id} />
                    )) }
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                    {/*<UserCard></UserCard>*/}
                </div>
            </div>
        </>
    )
}

export default DiscussionsListing;
