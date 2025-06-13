import {
  useDeleteBotMutation,
  useGetOwnedBotsQuery,
} from "../../api/bot/bot.api.ts";

function BotListing() {
  const { data: bots } = useGetOwnedBotsQuery();
  const [deleteBot] = useDeleteBotMutation();

  return (
    <>
      <p className="font-semibold text-xl"> My Bots </p>
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
        {!bots || bots.length === 0 ? (
          <p className="text-black/50"> You don't have a bot yet </p>
        ) : (
          bots.map((bot, index) => (
            <div className="flex flex-col h-full" key={bot.userId}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold"> Username: </p>
                  <p> {bot.userUsername} </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold"> Client id: </p>
                  <p> {bot.clientId} </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold"> Client secret: </p>
                  <p> {bot.clientSecret} </p>
                </div>
                <div
                  className="flex gap-1 text-red-500 items-center cursor-pointer"
                  onClick={() => deleteBot(bot.id)}
                >
                  <p className="font-semibold"> Delete this bot </p>
                  <i className="pi pi-trash" />
                </div>
              </div>
              {bots.length > 1 && index < bots.length - 1 && (
                <hr className="my-4 border-gray-300" />
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default BotListing;
