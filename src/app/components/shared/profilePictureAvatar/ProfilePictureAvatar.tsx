import { Avatar } from "primereact/avatar";
import { useEffect } from "react";

interface ProfilePictureAvatarProps {
  avatarType: "user" | "workspace";
  isCurrentUser?: boolean;
  url?: string;
  altText?: string;
  size?: "normal" | "large" | "xlarge";
  action?: () => void;
}

function ProfilePictureAvatar({
  avatarType,
  isCurrentUser,
  url,
  altText,
  size = "large",
  action = () => {},
}: ProfilePictureAvatarProps) {
  useEffect(() => {
    console.log("url", url);
  }, [url]);

  return (
    <>
      {
        avatarType === "user" ? (
          url ? (
            <Avatar image={url} size={size} />
          ) : (
            <Avatar
              label={altText}
              size={size}
              style={{
                backgroundColor: isCurrentUser
                  ? "var(--main-color-500)"
                  : "#F3F3F3",
                color: isCurrentUser ? "#ffffff" : "#000000",
                borderRadius: "8px",
              }}
            />
          )
        ) : url ? (
          <Avatar
            image={url}
            size={size}
            onClick={action}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <Avatar
            label={altText}
            size={size}
            onClick={action}
            style={{
              backgroundColor: "var(--main-color-500)",
              color: "#ffffff",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          />
        )
        // className="w-12 h-12 cursor-pointer rounded-lg"
      }
    </>
  );
}

export default ProfilePictureAvatar;
