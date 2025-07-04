import React from "react";

interface NumberProps {
  number: string | number | null | undefined;
  text?: string | number | undefined;
  className?: string;
}

const Number: React.FC<NumberProps> = ({ number, className, text }) => {
  return (
    <div>
      <p className={`text-3xl font-bold ${className}`}>
        {text} {number !== undefined ? number : ""}
      </p>
    </div>
  );
};

export default Number;
