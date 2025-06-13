import UserParametersLayout from "../../layouts/UserParametersLayout.tsx";
import BotListing from "../botListing/BotListing.tsx";
import { ErrorResponse } from "../../Models/Error.ts";
import { useState } from "react";
import { useCreateBotMutation } from "../../api/bot/bot.api.ts";
import { InputText } from "primereact/inputtext";

function BotParameters() {
  const [botUserName, setBotUserName] = useState<string>("");

  const [createBotRequest] = useCreateBotMutation();

  const [botErrorMessage, setBotErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [successBotMessage, setSuccessBotMessage] = useState<
    string | undefined
  >(undefined);

  const handleCreateBot = async () => {
    if (!botUserName || botUserName.trim() === "") {
      setBotErrorMessage("You must provide a username for your bot.");
      return;
    }
    setBotErrorMessage("");
    try {
      await createBotRequest(botUserName).unwrap();
      setSuccessBotMessage("Bot created successfully!");
      setBotUserName("");
    } catch (e) {
      const error = e as ErrorResponse;
      setBotErrorMessage(error.data.detail);
      return error;
    }
  };

  return (
    <UserParametersLayout>
      <div className="flex flex-1 flex-col gap-10">
        <p className="font-semibold text-xl"> Manage Bots </p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label className="flex" htmlFor="botUsername">
              Bot username
            </label>
            {botErrorMessage ? (
              <p className="text-xs text-left text-red-500">
                {botErrorMessage}
              </p>
            ) : null}
            <InputText
              name="botUsername"
              id="botUsername"
              className="border rounded border-black px-2 py-1"
              style={{ width: "50%" }}
              placeholder="Bot username"
              value={botUserName}
              onChange={(e) => setBotUserName(e.target.value ?? "")}
            />
          </div>
          <div className="flex flex-col gap-2">
            {successBotMessage ? (
              <p className="text-xs text-left text-green-600">
                {successBotMessage}
              </p>
            ) : null}
            <button
              className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg text-white w-fit"
              onClick={handleCreateBot}
            >
              <i className="pi pi-plus "></i>
              <p> Create a new bot </p>
            </button>
          </div>
        </div>
        <BotListing />
      </div>
    </UserParametersLayout>
  );
}

export default BotParameters;
