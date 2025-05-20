import Lottie from "lottie-react";
import welcomeAnimation from "../../../../assets/lottie-animations/welcome.json";
import googleIcon from "../../../../assets/icons/google.svg";
import GitHubIcon from "../../../../assets/icons/github.svg";
import microsoftIcon from "../../../../assets/icons/microsoft.svg";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import {
  RegisterDto,
  useRegisterMutation,
} from "../../../api/auth/auth.api.ts";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

function Register() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formStatus, setFormStatus] = useState<
    "submitted" | "pending" | "error" | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !username || !password) {
      setFormStatus("error");
      setErrorMessage("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      setFormStatus("error");
      setErrorMessage("Passwords do not match");
      return;
    }

    setFormStatus("pending");
    const body: RegisterDto = {
      email: email,
      userName: username,
      password: password,
    };

    try {
      const response = await register(body);
      if (response.data != null) {
        setFormStatus("submitted");
      } else {
        if (response.error && "status" in response.error) {
          setFormStatus("error");
          const fetchError = response.error as FetchBaseQueryError;
          const status = fetchError.status;

          if (status === 409) {
            setErrorMessage("Email already used");
          }
        }
      }
    } catch (error) {
      setFormStatus("error");
      console.log("Register failed:", error);
      setErrorMessage("An error occurred during register");
    }
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <div className="flex justify-center items-center">
          <div className="inline-flex flex-row justify-center p-10 bg-white gap-16">
            <div className="flex flex-col gap-12 w-[480px]">
              <div className="gap-12">
                <div className="flex flex-row gap-1">
                  <h1 className="text-4xl font-bold"> Welcome ! </h1>
                </div>
                <div className="flex">
                  <p className="text-[#000000]/50">
                    {" "}
                    Please enter your register informations{" "}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-1 bg-[#EEEEEE] rounded-lg border border-[#EEEEEE] p-1">
                  <button
                    onClick={() => navigate("/login")}
                    className="flex-1 p-2 bg-inherit text-black rounded-r-lg"
                  >
                    Sign up
                  </button>
                  <button className="flex-1 p-2 bg-white rounded-lg">
                    Sign in
                  </button>
                </div>
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
                <p
                  className={`flex m-0 min-h-6 text-red-500 ${formStatus === "error" ? "visible" : "invisible"}`}
                >
                  {errorMessage}
                </p>
                <Button
                  label="Continue"
                  type="submit"
                  className="w-full h-12 text-white bg-[#6B8AFD]"
                />
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
            <Lottie animationData={welcomeAnimation} className="" />
          </div>
        </div>
      </form>
    </>
  );
}

export default Register;
