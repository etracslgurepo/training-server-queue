import React from "react";

type SubtitleProps = {
  text: string | number | undefined;
  className?: string;
};

const SubTitle: React.FC<SubtitleProps> = ({ text, className }) => {
  return <div className={`text-2xl font-semibold ${className}`}>{text}</div>;
};

export default SubTitle;
