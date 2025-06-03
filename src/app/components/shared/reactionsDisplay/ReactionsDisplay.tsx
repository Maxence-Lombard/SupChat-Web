import { Reaction } from "../../../api/messages/messages.api.ts";

const ReactionsDisplay = ({
  reactions,
  currentUserId,
  onToggleReaction,
}: {
  reactions: Reaction[];
  currentUserId: number;
  onToggleReaction: (content: string) => void;
}) => {
  const reactionCounts = reactions.reduce(
    (acc, reaction) => {
      acc[reaction.content] = (acc[reaction.content] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="flex gap-2 items-center">
      {Object.entries(reactionCounts).map(([content, count]) => {
        const userHasReacted = reactions.some(
          (r) => r.content === content && r.senderId === currentUserId,
        );
        return (
          <p
            key={content}
            onClick={() => onToggleReaction(content)}
            className={`flex p-1 items-center gap-1 border rounded text-xs cursor-pointer ${
              userHasReacted
                ? "border-[var(--main-color-500)] bg-[var(--main-color-500)] text-white"
                : "border-[#ECECEC] bg-[#F3F3F3]"
            }`}
          >
            {content}
            <span className="font-semibold">{count}</span>
          </p>
        );
      })}
    </div>
  );
};

export default ReactionsDisplay;
