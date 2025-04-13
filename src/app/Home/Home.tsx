import {useState} from "react";
import './Home.css'
//ICONS
import searchIcon from '../../assets/icons/search.svg';
//COMPONENTS
import UserCard from "../components/shared/userCard/UserCard.tsx";
import ShortInfoUserCard from "../components/shared/short-info-user-card/ShortInfoUserCard.tsx";

function Home() {
    const [search, setSearch] = useState<string>('');


    return (
        <>
            <div className='flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8'>
                <div className='flex flex-col gap-8 '>
                    <div className='flex gap-1 p-2 w-full border rounded-lg border-black'>
                        <img
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
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                    </div>
                </div>
                <div className='flex flex-col gap-6 flex-1'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-center px-4 py-2 border rounded-lg border-[#ECECEC]'>
                        <p>Conversations actives - 18</p>
                    </div>
                        <div className='flex gap-1 p-2 w-full border rounded-lg border-black'>
                            <img
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
                    </div>
                    <div className='flex flex-col gap-2 h-full overflow-y-auto'>
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                        <ShortInfoUserCard />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
