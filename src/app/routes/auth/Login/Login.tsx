import Lottie from "lottie-react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useEffect, useState } from "react";
import facebookIcon from "../../../../assets/icons/facebook.svg";
import googleIcon from "../../../../assets/icons/google.svg";
import welcomeAnimation from "../../../../assets/lottie-animations/welcome.json";
import { LoginDto, useLoginMutation } from "../../../api/auth/auth.api";

function Login() {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [checked, setChecked] = useState<boolean>(false);
    const [login] = useLoginMutation();

    const handleLogin = async () => {
        const body: LoginDto = {
            username: email ?? 'bcrepin@supinfo.com', //TODO: add additional checks and remove fallback username
            password: password ?? 'Soleil123!', //TODO: add additional checks and remove fallback password
            grant_type: 'password',
        }

        try {
            const response = await login(body);
            console.log('Login successful:', response);
        } catch (error) {
            console.log('Login failed:', error);
        }
    };

    useEffect(() => {
        handleLogin();
    }, []);

    return (
        <>
            <div className='flex justify-center items-center min-h-screen'>
                <div className='inline-flex flex-row justify-center p-10 bg-white gap-16'>
                    <div className='flex flex-col gap-12'>
                        <div className='gap-12'>
                            <div className='flex flex-row gap-1'>
                                <h1 className='text-4xl font-bold'> Welcome Back ! </h1>
                                {/*<img src={handWave} alt="Hello"/>*/}
                            </div>
                            <div className=''>
                                <p className='text-[#000000]/50'> Sign in to your account to continue </p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-1 bg-[#EEEEEE] rounded-lg border border-[#EEEEEE] p-1'>
                                <button
                                    className='flex-1 p-2 bg-white rounded-lg'>
                                    Sign in
                                </button>
                                <button
                                    className='flex-1 p-2 bg-inherit text-black rounded-r-lg'>
                                    Sign up
                                </button>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='flex' htmlFor="firstname">Email</label>
                                <InputText
                                    id="firstname"
                                    className='w-full border rounded border-black px-2 py-1'
                                    placeholder='Email'
                                    value={email} onChange={(e) => setEmail(e.target.value ?? '')}
                                />
                            </div>
                            <div className='flex flex-col gap-1 items-end'>
                                <div className='flex flex-col w-full gap-1'>
                                    <label className='flex' htmlFor="password">Password</label>
                                    <Password
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value ?? '')}
                                        feedback={false}
                                        tabIndex={1}/>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={checked}
                                    onChange={e => setChecked(e.target.checked)}
                                    className='customCheckbox'
                                />
                                <label id='remember' htmlFor="remember">Remember me</label>
                            </div>
                        </div>
                        <Button label="Continue"
                                className='w-full h-12 text-white bg-[#6B8AFD]'/>
                        <p className='text-main-500 cursor-pointer'>I forgot my password</p>
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

export default Login
