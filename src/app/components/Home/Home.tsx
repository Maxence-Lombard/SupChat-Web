import {useState} from "react";
import './Home.css'
import ShortInfoUserCard from "../shared/short-info-user-card/ShortInfoUserCard.tsx";
import DiscussionsListing from "../shared/discussions-listing/DiscussionsListing.tsx";

function Home() {
    return (
        <>
            <div className='flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8'>
                <DiscussionsListing />
                <div className='flex flex-col gap-6 flex-1'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-center px-4 py-2 border rounded-lg border-[#ECECEC]'>
                        <p>Conversations actives - 18</p>
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
