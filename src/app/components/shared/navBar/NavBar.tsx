import messages from '../../../../assets/icons/messages.svg'
import activities from '../../../../assets/icons/activities.svg'
import settings from '../../../../assets/icons/settings.svg'
import workspacePH from '../../../../assets/icons/workspacePH.svg'
import add from '../../../../assets/icons/add.svg'
import user from '../../../../assets/placeholder/user1.svg'

function NavBar() {
    return (
        <>
            <div className='flex flex-col justify-between items-center w-28 h-full px-4 py-10'>
                <div className='flex flex-col gap-10'>
                    <div className='flex flex-col items-center gap-4'>
                        <img
                            className='w-8 h-8 cursor-pointer'
                            src={messages}
                            alt="messages"
                        />
                        <img
                            className='w-8 h-8 cursor-pointer'
                            src={activities}
                            alt="activities"
                        />
                        <img
                            className='w-8 h-8 cursor-pointer'
                            src={settings}
                            alt="settings"
                        />

                    </div>
                    <hr className='w-full border border-black/50 '/>
                    <div className='flex flex-col items-center gap-4'>
                        <img
                            className='w-12 h-12 cursor-pointer rounded-lg'
                            src={workspacePH}
                            alt="workspacePH"
                        />
                        <img
                            className='w-12 h-12 cursor-pointer rounded-lg'
                            src={workspacePH}
                            alt="workspacePH"
                        />
                        <img
                            className='w-12 h-12 cursor-pointer rounded-lg'
                            src={workspacePH}
                            alt="workspacePH"
                        />
                        <button className='flex items-center justify-center w-12 h-12 bg-white border border-[#ECECEC] rounded-lg'>
                            <img
                                src={add}
                                alt="add"
                            />
                        </button>

                    </div>
                </div>
                <div>
                    <img
                        className='w-12 h-12 cursor-pointer rounded-lg'
                        src={user}
                        alt="user"
                    />
                </div>
            </div>
        </>
    )
}

export default NavBar
