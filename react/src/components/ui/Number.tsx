import React from "react";

interface NumberProps {
  className?: string;
  children: React.ReactNode;
}

const Number: React.FC<NumberProps> = ({ children, className = "" }) => {
  return (
    <div>
      <p className={`text-3xl font-bold ${className}`}>
        {children}
      </p>
    </div>
  );
};

export default Number;
