interface DeletePopupProps {
  itemToDelete: string;
  deleteAction: () => void | Promise<void>;
  hide: () => void;
}

function DeletePopup({ itemToDelete, deleteAction, hide }: DeletePopupProps) {
  return (
    <>
      <div className="flex flex-col items-center gap-6 text-black p-4 border bg-white border-[#ECECEC] rounded-2xl">
        <p className="font-semibold text-xl">Delete confirmation</p>
        <p> Are you sure you want to delete this {itemToDelete} ? </p>
        <div className="flex gap-4">
          <button
            className="flex gap-2 px-4 py-2 items-center border border-[#ECECEC] rounded-lg text-black"
            onClick={() => hide()}
          >
            <i className="pi pi-times"></i>
            <p> Cancel </p>
          </button>
          <button
            className="flex gap-2 px-4 py-2 items-center bg-red-500 rounded-lg text-white"
            onClick={deleteAction}
          >
            <i className="pi pi-trash"></i>
            <p> Delete </p>
          </button>
        </div>
      </div>
    </>
  );
}

export default DeletePopup;
