import React from "react";

interface AccordionProps {
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <div className="w-[90%]">{children}</div>;
};

export default Accordion;
