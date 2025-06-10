import UserParametersLayout from "../../layouts/UserParametersLayout";
import { Password } from "primereact/password";
import { useEffect, useState } from "react";
import { ErrorResponse } from "../../Models/Error.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import {
  useGetExportUserDataQuery,
  useUpdateUserPasswordMutation,
} from "../../api/user/user.api.ts";

function SecuritySettings() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fetchUserData, setFetchUserData] = useState<boolean>(false);

  const [modifyUserPassword] = useUpdateUserPasswordMutation();
  const { data: userData, isFetching } = useGetExportUserDataQuery(undefined, {
    skip: !fetchUserData,
  });

  const userId = useSelector((state: RootState) => state.users.currentUserId);

  const handleChangePassword = async () => {
    if (!userId || !oldPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage("Please fill all the fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New password and confirmation do not match");
      return;
    }
    try {
      await modifyUserPassword({
        userId: userId,
        currentPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }).unwrap();
    } catch (e) {
      const error = e as ErrorResponse;
      setErrorMessage(
        error.data.detail || "An error occurred while changing password",
      );
    }
  };

  useEffect(() => {
    if (userData) {
      const url = window.URL.createObjectURL(userData);
      const a = document.createElement("a");
      a.href = url;
      a.download = "personal_data.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setFetchUserData(false);
    }
  }, [userData]);

  return (
    <UserParametersLayout>
      <div className="flex flex-1 flex-col gap-10">
        <p className="font-semibold text-xl"> Security </p>
        <div className="flex flex-col gap-4">
          <p className="font-semibold"> Change your password </p>
          <div className="flex flex-col w-full gap-1">
            <label className="flex" htmlFor="oldPassword">
              Old password
            </label>
            <div className="flex flex-col gap-1">
              <Password
                name="oldPassword"
                id="oldPassword"
                placeholder="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                toggleMask
                className="max-w-lg"
                feedback={false}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="flex" htmlFor="newPassword">
              New password
            </label>
            <div className="flex flex-col gap-1">
              <Password
                name="newPassword"
                id="newPassword"
                placeholder="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                toggleMask
                className="max-w-lg"
                feedback={false}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="flex" htmlFor="confirmNewPassword">
              Confirm new password
            </label>
            <div className="flex flex-col gap-1">
              <Password
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                toggleMask
                className="max-w-lg"
                feedback={false}
              />
            </div>
          </div>
          <div>
            {errorMessage ? (
              <p className="text-xs text-red-500">{errorMessage}</p>
            ) : null}
            <button
              className="all-[unset] w-full max-w-lg text-white rounded-lg bg-[var(--main-color-500)] p-2"
              onClick={handleChangePassword}
            >
              Change password
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-semibold"> RGPD rights </p>
          <button
            className="all-[unset] flex w-fit text-white rounded-lg bg-[var(--main-color-500)] p-2"
            onClick={() => {
              setFetchUserData(true);
            }}
            disabled={isFetching}
          >
            Export personal data
          </button>
        </div>
      </div>
    </UserParametersLayout>
  );
}

export default SecuritySettings;
