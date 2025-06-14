import Lottie from "lottie-react";
import welcomeAnimation from "../../../../assets/lottie-animations/welcome.json";
import googleIcon from "../../../../assets/icons/google.svg";
import GitHubIcon from "../../../../assets/icons/github.svg";
import microsoftIcon from "../../../../assets/icons/microsoft.svg";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  RegisterDto,
  useRegisterMutation,
} from "../../../api/auth/auth.api.ts";
import { ErrorResponse } from "../../../Models/Error.ts";
import { useInvitationHandler } from "../../../hooks/useInvitationHandler.ts";

function Register() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const { hasPendingInvitation } = useInvitationHandler();

  const returnUrl = searchParams.get("returnUrl");
  const invitationMessage =
    location.state?.message ||
    (returnUrl?.includes("/invitation/accept")
      ? "Please sign in to accept this invitation"
      : "") ||
    (hasPendingInvitation()
      ? "Sign in to accept your workspace invitation"
      : "");

  const handleRegister = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!email || !username || !password) {
      setErrorMessage("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    setErrorMessage("");
    const body: RegisterDto = {
      email: email,
      userName: username,
      password: password,
    };

    try {
      await register(body).unwrap();
      console.log("Registration successful");
      setSuccessMessage(
        "Registration successful, please check you mail to confirm your account",
      );
    } catch (e) {
      console.log(e);
      const error = e as ErrorResponse;
      setErrorMessage(error.data.detail);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="inline-flex flex-row justify-center p-10 bg-white gap-16">
          <div className="flex flex-col gap-10 w-[408px]">
            <div>
              <div className="flex flex-row gap-1">
                <h1 className="text-4xl font-bold"> Welcome ! </h1>
              </div>
              <div className="flex">
                <p className="text-[#000000]/50">
                  Please enter your register informations
                </p>
              </div>
              {invitationMessage && (
                <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
                  {invitationMessage}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-1 bg-[#EEEEEE] rounded-lg border border-[#EEEEEE] p-1">
                  <button
                    onClick={() => navigate("/login")}
                    className="flex-1 p-2 bg-inherit text-black rounded-r-lg"
                  >
                    Sign in
                  </button>
                  <button className="flex-1 p-2 bg-white rounded-lg">
                    Sign up
                  </button>
                </div>
              </div>
              <form className="flex flex-col gap-10" onSubmit={handleRegister}>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="flex" htmlFor="email">
                        Email
                      </label>
                      <InputText
                        id="email"
                        type="email"
                        className="w-full border rounded border-black px-2 py-1"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="flex" htmlFor="username">
                        Username
                      </label>
                      <InputText
                        id="username"
                        className="w-full border rounded border-black px-2 py-1"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="flex" htmlFor="password">
                      Password
                    </label>
                    <Password
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      toggleMask
                      feedback={false}
                      tabIndex={1}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="flex" htmlFor="password">
                      Confirm Password
                    </label>
                    <Password
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      toggleMask
                      feedback={false}
                      tabIndex={1}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {errorMessage ? (
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  ) : null}
                  {successMessage ? (
                    <p className="text-xs text-green-600">{successMessage}</p>
                  ) : null}
                  <Button
                    label="Continue"
                    type="submit"
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
              <button className="flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg">
                <img src={googleIcon} alt="Google" />
                <span>Google</span>
              </button>
              <button className="flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg">
                <img src={microsoftIcon} alt="Microsoft" />
                <span>Microsoft</span>
              </button>
              <button className="flex gap-2 items-center justify-center w-full h-12 bg-white border border-black rounded-lg">
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

export default Register;
