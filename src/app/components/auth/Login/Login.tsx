import Lottie from "lottie-react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import facebookIcon from "../../../../assets/icons/facebook.svg";
import googleIcon from "../../../../assets/icons/google.svg";
import welcomeAnimation from "../../../../assets/lottie-animations/welcome.json";
import { LoginDto, useLoginMutation } from "../../../api/auth/auth.api";
import {loginSuccess} from "../../../store/authSlice.ts";
import {useDispatch} from "react-redux";

function Login() {
    const location = useLocation();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState<'submitted' | 'pending' | 'error' | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [login] = useLoginMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const state = location.state as { email?: string };
        if (state?.email) {
            setEmail(state.email);
        }
    }, [location]);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email || !password) {
            setFormStatus('error');
            setErrorMessage('Please fill all the fields');
            return;
        }
        setFormStatus('pending');
        const body: LoginDto = {
            email: email,
            password: password,
            grant_type: 'password',
        }

        try {
            const response = await login(body);
            if (response.data?.accessToken) {
                setFormStatus('submitted');
                console.log('Login successful:', response);

                dispatch(loginSuccess(response.data.accessToken)); // à voir si on l'utilise ou le local storage
                localStorage.setItem('access_token', response.data.accessToken);

                // TODO: changer pr la main page
                navigate('/');
            } else {
                setFormStatus('error');
                setErrorMessage('Invalid email or password');
            }
        } catch (error) {
            setFormStatus('error');
            console.log('Login failed:', error);
            setErrorMessage('An error occurred during login');
        }
    };

    return (
        <>
            <form onSubmit={handleLogin}>
                <div className='flex justify-center items-center border rounded'>
                    <div className='inline-flex flex-row justify-center p-10 bg-white gap-16'>
                        <div className='flex flex-col gap-12 w-[480px]'>
                            <div className='gap-12'>
                                <div className='flex flex-row gap-1'>
                                    <h1 className='text-4xl font-bold'> Welcome Back ! </h1>
                                    {/*<img src={handWave} alt="Hello"/>*/}
                                </div>
                                <div className='flex'>
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
                                        onClick={() => navigate("/register")}
                                        className='flex-1 p-2 bg-inherit text-black rounded-r-lg'>
                                        Sign up
                                    </button>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='flex' htmlFor="firstname">Email</label>
                                    <InputText
                                        keyfilter="email"
                                        invalid={formStatus === 'error'}
                                        name="email"
                                        id="firstname"
                                        className='w-full border rounded border-black px-2 py-1'
                                        placeholder='Email'
                                        value={email} onChange={(e) => setEmail(e.target.value ?? '')}
                                    />
                                </div>
                                <div className='flex flex-col gap-1 items-end'>
                                    <div className='flex flex-col w-full gap-1'>
                                        <label className='flex' htmlFor="password">Password</label>
                                        <div className='flex flex-col gap-1'>
                                            <Password
                                                name="email"
                                                id="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                toggleMask
                                                feedback={false}
                                                tabIndex={1} />
                                            <p className='text-[#6B8AFD] text-sm cursor-pointer self-end'>Forgot password ?</p>
                                        </div>
                                    </div >
                                </div >
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
                            </div >
                            <div className='flex flex-col gap-1'>
                                <p className={`flex m-0 min-h-6 text-red-500 ${formStatus === 'error' ? 'visible' : 'invisible'}`}>
                                    {errorMessage}
                                </p>
                                <Button label="Continue"
                                    disabled={formStatus === 'pending'}
                                    type='submit'
                                    className='w-full h-12 text-white bg-[#6B8AFD]' />
                            </div>
                            <div className='flex items-center gap-1 text-black/30'>
                                <hr className='flex-1' />
                                <span className='inline'> Or connect with </span>
                                <hr className='flex-1' />
                            </div>
                            <div className='flex gap-4'>
                                <button
                                    className='flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg'>
                                    <img src={googleIcon} alt="Google" />
                                    <span>Google</span>
                                </button>
                                <button
                                    className='flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg'>
                                    <img src={facebookIcon} alt="Google" />
                                    <span>Facebook</span>
                                </button>
                            </div>
                        </div >
                        <Lottie animationData={welcomeAnimation} className='' />
                    </div >
                </div >
            </form >
        </>
    )
}

export default Login
