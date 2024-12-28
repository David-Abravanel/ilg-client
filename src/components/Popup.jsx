import "./popup.css";
import React, { useEffect } from "react";

export const Popup = ({ open, onClose, children }) => {
  useEffect(() => {
    if (open) {
      const handleOutsideClick = (e) => {
        if (e.target.classList.contains("popup")) {
          onClose();
        }
      };
      document.addEventListener("click", handleOutsideClick);
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [open, onClose]);

  return (
    open && (
      <div className="popup">
        <div className="popup-content">{children}</div>
      </div>
    )
  );
};
