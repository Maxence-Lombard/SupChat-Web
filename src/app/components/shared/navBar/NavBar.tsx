import messages from '../../../../assets/icons/Components/messages.png'
import activities from '../../../../assets/icons/Components/activities.png'
import settings from '../../../../assets/icons/Components/settings.png'

function NavBar() {
    return (
        <>
            <div className='w-28 h-full px-4 py-10'>
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
                <hr className='w-full '/>
            </div>
        </>
    )
}

export default NavBar
