import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import DeletePopup from "../popups/deletePopup/DeletePopup.tsx";
import { useLocation, useNavigate } from "react-router-dom";

interface ParametersLeftPanelProps {
  navigationItems: {
    name: string;
    urlToNavigate: string;
  }[];
  deleteAction: () => Promise<void>;
  itemToDelete: string;
  logoutAction?: () => void;
}

function ParametersLeftPanel({
  navigationItems,
  deleteAction,
  itemToDelete,
  logoutAction,
}: ParametersLeftPanelProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState<boolean>(false);

  return (
    <>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {navigationItems.map((item) => {
              const isCurrent = location.pathname === item.urlToNavigate;
              // .startsWith(item.urlToNavigate) use this instead if dynamic url
              return (
                <p
                  key={item.name}
                  className={
                    isCurrent
                      ? "w-max px-2 py-1 bg-[#6B8AFD]/10 text-[#6B8AFD] rounded-2xl cursor-pointer"
                      : "cursor-pointer px-2 py-1"
                  }
                  onClick={() => navigate(item.urlToNavigate)}
                >
                  {item.name}
                </p>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {logoutAction ? (
              <div
                onClick={() => logoutAction()}
                className="flex gap-2 items-center cursor-pointer"
                style={{ color: "var(--main-color-500)" }}
              >
                <p> Log out </p>
                <i className="pi pi-sign-out" />
              </div>
            ) : null}
            <div
              className="flex flex-nowrap gap-2 items-center text-red-500 cursor-pointer"
              onClick={() => setDeleteConfirmationVisible(true)}
            >
              <p className="whitespace-nowrap"> Delete {itemToDelete} </p>
              <i className="pi pi-trash"></i>
            </div>
          </div>
        </div>
        {/* Separation line */}
        <div className="w-px h-full bg-black rounded-full"></div>
      </div>
      {/* CONFIRM DELETE POPUP */}
      <Dialog
        className="rounded-2xl"
        visible={deleteConfirmationVisible}
        modal
        onHide={() => {
          if (!deleteConfirmationVisible) return;
          setDeleteConfirmationVisible(false);
        }}
        content={({ hide }) => (
          <DeletePopup
            itemToDelete={itemToDelete}
            deleteAction={async () => {
              await deleteAction();
              setDeleteConfirmationVisible(false);
              hide({} as React.SyntheticEvent);
            }}
            hide={() => hide({} as React.SyntheticEvent)}
          />
        )}
      ></Dialog>
    </>
  );
}

export default ParametersLeftPanel;
