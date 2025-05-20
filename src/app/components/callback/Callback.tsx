import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookieHelper.ts";
import { loginSuccess } from "../../store/slices/authSlice.ts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cookieConstants } from "../../constants/cookieConstants.ts";

function Callback() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCallback = () => {
    const token = getCookie(cookieConstants.accessToken);
    if (token) {
      console.log("Token found:", token);
      dispatch(loginSuccess());
      navigate("/");
    } else {
      setError("Sorry an error occurred, please try again.");
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  //TODO: ajouter image lottie + message d'erreur
  return (
    <div>
      <h1>Callback</h1>
      <p> {error} </p>
    </div>
  );
}

export default Callback;
