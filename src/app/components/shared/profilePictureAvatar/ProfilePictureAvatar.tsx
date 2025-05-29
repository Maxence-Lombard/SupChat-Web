import { Avatar } from "primereact/avatar";

interface ProfilePictureAvatarProps {
  avatarType: "user" | "workspace";
  url?: string;
  altText?: string;
  size?: "normal" | "large" | "xlarge";
  action?: () => void;
}

function ProfilePictureAvatar({
  avatarType,
  url,
  altText,
  size = "large",
  action = () => {},
}: ProfilePictureAvatarProps) {
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
                backgroundColor: "var(--main-color-500)",
                color: "#ffffff",
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
