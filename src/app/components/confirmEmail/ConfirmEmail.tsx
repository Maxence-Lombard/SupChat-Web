import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice.ts";
import { useConfirmEmailMutation } from "../../api/auth/auth.api.ts";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { cookieConstants } from "../../constants/cookieConstants.ts";

function ConfirmEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const code = searchParams.get("code");
  const userId = searchParams.get("userId");
  const [confirmEmail] = useConfirmEmailMutation();
  const [, setCookie] = useCookies([
    cookieConstants.accessToken,
    cookieConstants.refreshToken,
  ]);

  const handleConfirmEmail = async () => {
    if (!code || !userId) return;
    const response = await confirmEmail({ code: code, userId: userId });
    if (response.error) {
      console.log("Error confirming email:", response.error);
      return;
    }
    setCookie(cookieConstants.accessToken, response.data.accessToken, {
      path: "/",
    });
    setCookie(cookieConstants.refreshToken, response.data.refreshToken, {
      path: "/",
    });
    dispatch(loginSuccess());
    navigate("/");
    window.location.replace("/");
  };

  useEffect(() => {
    handleConfirmEmail();
  }, [code, userId]);

  return <></>;
}

export default ConfirmEmail;
