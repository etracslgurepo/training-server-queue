import React, { ReactElement, useState } from "react";
import Accordion from "../../ui/accordion/Accordion";
import AccordionItem from "../../ui/accordion/AccordionItem";
import Bpls from "../../groups/Bpls";
import Rpt from "../../groups/Rpt";
import Tc from "../../groups/Tc";
import General from "../../groups/General";
import Title from "../Title";
import { IoMdBriefcase } from "react-icons/io";
import { FaHouseChimney } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { LuSettings2 } from "react-icons/lu";

interface SidebarProps {
  onItemClick: (item: ReactElement) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>("General");

  const items = [
    {
      component: <General title="General" />,
      icon: <LuSettings2 />,
      title: "General",
    },
    {
      component: <Tc title="Treasury and Collection" />,

      title: "Tc",
    },
    {
      component: <Bpls title="Business Permit" />,

      title: "Bpls",
    },
    {
      component: <Rpt title="Real Property Tax" />,

      title: "Rpt",
    },
  ];

  const handleItemClick = (component: ReactElement, title: string) => {
    setSelectedItem(title);
    onItemClick(component);
  };

  return (
    <div className="w-[20%] bg-white shadow-[5px_0_20px_-10px_rgba(0,0,0,0.2)] flex flex-col items-center rounded z-10">
      <Title
        text="settings"
        className="capitalize !text-2xl text-center pb-5"
      />
      <div className="w-full flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => handleItemClick(item.component, item.title)}
              className={`pl-5 cursor-pointer flex gap-4 items-center text-xl py-2 ${
                selectedItem === item.title
                  ? "bg-sky-200 mx-4 transition-all duration-200 ease-in rounded-lg"
                  : ""
              }`}
            >
              {item.icon}
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
