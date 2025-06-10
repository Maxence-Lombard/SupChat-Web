import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";

interface CheckUserCardProps {
  user: { id: number; username: string; imageId?: string };
  checked: boolean;
  onChange: () => void;
}

function CheckUserCard({ user, checked, onChange }: CheckUserCardProps) {
  //TODO: recup url de l'image via store, sinon get puis ajouter dans le store

  return (
    <div
      className="flex py-1 px-2 items-center justify-between border bg-white border-[#ECECEC] rounded-lg cursor-pointer"
      onClick={onChange}
    >
      <div className="flex items-center gap-3 w-[400px]">
        <ProfilePictureAvatar
          avatarType={"user"}
          url={""}
          size={"xlarge"}
          altText={user?.username?.charAt(0).toUpperCase()}
        />
        <p className="font-semibold"> {user.username} </p>
      </div>
      <label className="custom-checkbox-wrapper">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="check-icon">
          <i className="pi pi-check text-white" />
        </span>
      </label>
    </div>
  );
}

export default CheckUserCard;
