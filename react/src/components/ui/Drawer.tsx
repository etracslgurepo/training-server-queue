import React from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-[50%] absolute bottom-0 bg-white shadow transition-transform ${
          isOpen ? "transform translate-y-0" : "transform translate-y-full"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
