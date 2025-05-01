import UserCard from "../userCard/UserCard.tsx";
import {useEffect, useState} from "react";
import {useGetUserWithMessagesQuery} from "../../../api/user/user.api.ts";

function DiscussionsListing() {
    const [search, setSearch] = useState<string>('');

    const { data: users } = useGetUserWithMessagesQuery(undefined);
    useEffect(() => {
        if (users) {
            console.log(users);
        } else {
            console.log('no users');
        }
    }, [users]);
    return (
        <>
            <div className='flex flex-col gap-8 min-w-[231px]'>
                <div className='flex items-center gap-1 p-2 w-full border rounded-lg border-black'>
                    <i className='pi pi-search text-[#505050]/50'></i>
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
                </div>
            </div>
        </>
    )
}

export default DiscussionsListing;
