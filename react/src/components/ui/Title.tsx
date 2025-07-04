import React from "react";

type TitleProps = {
  text: string | string[];
  className?: string;
};

const Title: React.FC<TitleProps> = ({ text, className }) => {
  return <div className={`text-4xl font-bold ${className}`}>{text}</div>;
};

export default Title;
