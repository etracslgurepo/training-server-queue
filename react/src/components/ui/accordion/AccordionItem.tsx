import React, { useState } from "react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-black">
      <div
        className="flex justify-between items-center cursor-pointer p-3 transition-colors duration-300 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span
          className={`transform ${
            isOpen ? "rotate-180" : "rotate-0"
          } transition-transform`}
        >
          ▼
        </span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-full opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
