import Lottie from "lottie-react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import GitHubIcon from "../../../../assets/icons/github.svg";
import googleIcon from "../../../../assets/icons/google.svg";
import microsoftIcon from "../../../../assets/icons/microsoft.svg";
import welcomeAnimation from "../../../../assets/lottie-animations/welcome.json";
import { LoginDto } from "../../../api/auth/auth.api";
import { useAuth } from "../../../hooks/useAuth.tsx";
import { loginSuccess } from "../../../store/slices/authSlice.ts";
import { useGetUserInfosQuery } from "../../../api/user/user.api.ts";
import { addUser, setCurrentUserId } from "../../../store/slices/usersSlice.ts";
import { ErrorResponse } from "../../../Models/Error.ts";

enum Providers {
  GOOGLE = "google",
  Microsoft = "microsoft",
  GitHub = "github",
}

function Login() {
  const location = useLocation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formStatus, setFormStatus] = useState<
    "submitted" | "pending" | "error" | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fetchUserInfos, setFetchUserInfos] = useState<boolean>(true);

  const { login } = useAuth();
  const { data: userInfos } = useGetUserInfosQuery(undefined, {
    skip: fetchUserInfos,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { email?: string };
    if (state?.email) {
      setEmail(state.email);
    }
  }, [location]);

  const handleLogin = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!email || !password) {
      setFormStatus("error");
      setErrorMessage("Please fill all the fields");
      return;
    }
    setFormStatus("pending");
    const credentials: LoginDto = {
      email: email,
      password: password,
      grant_type: "password",
    };
    setErrorMessage("");

    try {
      const response = await login(credentials);
      if (response.accessToken) {
        setFormStatus("submitted");
        dispatch(loginSuccess());
        setFetchUserInfos(false);
        if (userInfos) {
          dispatch(setCurrentUserId(userInfos.applicationUser.id));
          dispatch(addUser(userInfos.applicationUser));
        }
        navigate("/");
      } else {
        setFormStatus("error");
        setErrorMessage("Invalid email or password");
      }
    } catch (e) {
      const error = e as ErrorResponse;
      setFormStatus("error");
      setErrorMessage(error.data.detail || "Invalid email or password");
      return e;
    }
  };

  const HandleProviderLogin = (provider: string) => {
    const returnUrl = encodeURIComponent(
      "http://localhost:5173/login/callback",
    );
    window.location.href = `http://localhost:5263/api/authorization/login/${provider}?returnUrl=${returnUrl}`;
  };

  return (
    <>
      <div className="flex justify-center items-center border rounded">
        <div className="inline-flex flex-row justify-center p-10 bg-white gap-16">
          <div className="flex flex-col gap-10 w-[408px]">
            <div>
              <div className="flex flex-row gap-1">
                <h1 className="text-4xl font-bold"> Welcome Back ! </h1>
              </div>
              <div className="flex">
                <p className="text-[#000000]/50">
                  Sign in to your account to continue
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-1 bg-[#EEEEEE] rounded-lg border border-[#EEEEEE] p-1">
                <button className="flex-1 p-2 bg-white rounded-lg">
                  Sign up
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 p-2 bg-inherit text-black rounded-r-lg"
                >
                  Sign in
                </button>
              </div>
              <form className="flex flex-col gap-10" onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="flex" htmlFor="firstname">
                      Email
                    </label>
                    <InputText
                      keyfilter="email"
                      invalid={formStatus === "error"}
                      name="email"
                      type="email"
                      id="firstname"
                      className="w-full border rounded border-black px-2 py-1"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value ?? "")}
                    />
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex flex-col w-full gap-1">
                      <label className="flex" htmlFor="password">
                        Password
                      </label>
                      <div className="flex flex-col gap-1">
                        <Password
                          name="password"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          toggleMask
                          feedback={false}
                          tabIndex={1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {errorMessage ? (
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  ) : null}
                  <Button
                    label="Continue"
                    type="submit"
                    disabled={formStatus === "pending"}
                    className="w-full h-12 text-white bg-[#6B8AFD]"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center gap-1 text-black/30">
              <hr className="flex-1" />
              <span className="inline"> Or connect with </span>
              <hr className="flex-1" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => HandleProviderLogin(Providers.GOOGLE)}
                className="flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg"
              >
                <img src={googleIcon} alt="Google" />
                <span>Google</span>
              </button>
              <button
                onClick={() => HandleProviderLogin(Providers.Microsoft)}
                className="flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg"
              >
                <img src={microsoftIcon} alt="Microsoft" />
                <span>Microsoft</span>
              </button>
              <button
                onClick={() => HandleProviderLogin(Providers.GitHub)}
                className="flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg"
              >
                <img src={GitHubIcon} alt="GitHub" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
          <Lottie
            animationData={welcomeAnimation}
            className="flex-1 hidden lg:block"
          />
        </div>
      </div>
    </>
  );
}

export default Login;
