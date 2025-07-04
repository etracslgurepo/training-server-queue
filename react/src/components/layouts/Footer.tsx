import React from "react";
import Title from "../ui/Title";

type FooterProps = {
  componentType?: string | undefined;
  fontFamily?: string;
};

const Footer: React.FC<FooterProps> = ({ componentType, fontFamily }) => {
  return (
    <div id={componentType} style={{ fontFamily: fontFamily }}>
      <Title
        text="QueueEtracs is a complete enterprise software system for customer queue management system."
        className="text-[20px] p-2 text-center text-white"
      />
    </div>
  );
};

export default Footer;
