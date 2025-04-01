import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <p>HOME</p>

                <button onClick={() => navigate("/login")}
                    className='px-4 py-2 m-2 border border-black rounded-lg'>
                    Login
                </button>
            </div>
        </>
    )
}

export default Home
