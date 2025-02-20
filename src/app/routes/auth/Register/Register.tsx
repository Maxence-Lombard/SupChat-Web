import Lottie from "lottie-react";
import welcomeAnimation from "../../../../assets/lottie-animations/welcome.json";
import googleIcon from "../../../../assets/icons/google.svg";
import facebookIcon from "../../../../assets/icons/facebook.svg";
import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {Password} from "primereact/password";
import {Button} from "primereact/button";

function Register() {
    const [email, setEmail] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();

    return (
        <>
            <div className='flex justify-center items-center min-h-screen'>
                <div className='inline-flex flex-row justify-center p-10 bg-white gap-16'>
                    <div className='flex flex-col px-8 py-6 gap-12'>
                        <div className='gap-12'>
                            <div className='flex flex-row gap-1'>
                                <h1 className='text-4xl font-bold'> Welcome ! </h1>
                                {/*<img src={handWave} alt="Hello"/>*/}
                            </div>
                            <div className=''>
                                <p className='text-[#000000]/50'> Please enter your register informations </p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-1 bg-[#EEEEEE] rounded-lg border border-[#EEEEEE] p-1'>
                                <button
                                    className='flex-1 p-2 bg-inherit text-black rounded-r-lg'>
                                    Sign in
                                </button>
                                <button
                                    className='flex-1 p-2 bg-white rounded-lg'>
                                    Sign up
                                </button>
                            </div>
                            <div className='flex gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="email">Email</label>
                                    <InputText
                                        id="email"
                                        className='w-full border rounded border-black px-2 py-1'
                                        placeholder='Email'
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="username">Username</label>
                                    <InputText
                                        id="username"
                                        className='w-full border rounded border-black px-2 py-1'
                                        placeholder='Username'
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="password">Password</label>
                                <Password
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    feedback={false}
                                    tabIndex={1}/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="password">Confirm Password</label>
                                <Password
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    feedback={false}
                                    tabIndex={1}/>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='m-0 text-red-500'>Please enter a valid email</p>
                            <Button label="Continue"
                                    className='w-full h-12 text-white bg-[#6B8AFD]'/>
                        </div>
                        <div className='flex items-center gap-1 text-black/30'>
                            <hr className='flex-1'/>
                            <span className='inline'> Or connect with </span>
                            <hr className='flex-1'/>
                        </div>
                        <div className='flex gap-4'>
                            <button
                                className='flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg'>
                                <img src={googleIcon} alt="Google"/>
                                <span>Google</span>
                            </button>
                            <button
                                className='flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg'>
                                <img src={facebookIcon} alt="Google"/>
                                <span>Facebook</span>
                            </button>
                        </div>
                    </div>
                    <Lottie animationData={welcomeAnimation} className=''/>
                </div>
            </div>
        </>
    )
}

export default Register