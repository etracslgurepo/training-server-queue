import React from "react";

type TextProps = {
children: React.ReactNode
  className?: string;
};

const Text: React.FC<TextProps> = ({ children, className }) => {
  return <div className={`text-4xl font-bold ${className}`}>{children}</div>;
};

export default Text;
