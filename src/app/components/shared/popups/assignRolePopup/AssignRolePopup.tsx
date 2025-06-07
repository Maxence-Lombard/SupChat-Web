import CheckUserCard from "../../checkUserCard/CheckUserCard.tsx";

interface AssignRolePopupProps {
  hide: () => void;
  name: string;
  workspaceMembers: { name: string; image: string | undefined }[];
}

function AssignRolePopup({
  hide,
  name,
  workspaceMembers,
}: AssignRolePopupProps) {
  return (
    <div className="flex flex-col text-black px-8 py-6 border bg-white border-[#ECECEC] rounded-2xl">
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-xl"> Assign {name} role </p>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            {workspaceMembers.map((member, index) => (
              <CheckUserCard
                key={index}
                user={{ firstName: member.name, image: member.image }}
              />
            ))}
          </div>
          <div className="flex self-end gap-2">
            <button
              className="flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg"
              onClick={() => hide()}
            >
              <i
                className="pi pi-times"
                style={{ color: "var(--main-color-500)" }}
              ></i>
              <p className="text-[#687BEC]">Cancel</p>
            </button>
            <button className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg">
              <i className="pi pi-plus text-white"></i>
              <p className="text-white">Create the workspace</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignRolePopup;
