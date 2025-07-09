// Sidebar.tsx

import React, { ReactElement, useState } from "react";
import Text from "@/components/ui/Text";

interface SidebarProps {
  onItemClick: (item: ReactElement) => void;
  items: Record<string, any>[];
  handleGroupChange: (groupId: string) => void;  // Pass groupId on click
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick, items, handleGroupChange }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>("GENERAL");

  const handleItemClick = (component: ReactElement, title: string, groupId: string) => {
    setSelectedItem(title);
    handleGroupChange(groupId); // Pass selected groupId when item is clicked
    onItemClick(component);
  };

  return (
    <div className="w-[20%] bg-white shadow-[5px_0_20px_-10px_rgba(0,0,0,0.2)] flex flex-col items-center rounded z-10">
      <Text className="capitalize !text-2xl text-center pb-5">Settings</Text>
      <div className="w-full flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="uppercase">
            <div
              onClick={() => handleItemClick(item.objid, item.title, item.objid.toLowerCase())}
              className={`pl-5 cursor-pointer flex gap-4 items-center text-xl py-2 ${selectedItem === item.title ? "bg-sky-200 mx-6 transition-all duration-200 ease-in rounded-lg" : "underline-hover"}`}
            >
              {item.objid}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
