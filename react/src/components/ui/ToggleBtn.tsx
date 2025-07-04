import React, { useState, useEffect } from "react";

interface ToggleButtonProps {
  text?: string;
  isActive: boolean;
  onClick: () => void;
  componentType?: string;
  className?: string | undefined;
  caption?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  text,
  isActive,
  onClick,
  componentType,
  className,
  caption,
}) => {
  const [circlePosition, setCirclePosition] = useState(
    isActive ? "translate-x-full" : "translate-x-0"
  );

  const [circleColor, setCircleColor] = useState(
    isActive ? "bg-sky-400" : "bg-gray-400"
  );

  useEffect(() => {
    setCirclePosition(isActive ? "translate-x-full" : "translate-x-0");
    setCircleColor(isActive ? "bg-sky-400" : "bg-gray-400");
  }, [isActive]);

  const handleClick = () => {
    onClick();
    setCirclePosition((prevPosition) =>
      prevPosition === "translate-x-full" ? "translate-x-0" : "translate-x-full"
    );
    setCircleColor(isActive ? "bg-sky-400" : "bg-gray-400");
  };

  return (
    <div
      id={componentType}
      className={`flex items-center flex-col ${className}`}
    >
      <h1>{caption}</h1>
      <button
        className={`relative w-8 h-[15px] ${
          isActive ? "bg-sky-200" : "bg-gray-300"
        }  rounded-full outline-none focus:outline-none text-[5px]`}
        onClick={handleClick}
      >
        <span
          className={`absolute left-0 top-[-0.5px] w-4 h-4 rounded-full shadow-md transform transition-transform ${circlePosition} ${circleColor}`}
        >
          <p className="hover:bg-gray-500 hover:bg-opacity-30 rounded-full py-[11px] px-[11px] absolute left-[-3px] top-[-3px] z-[1px]"></p>
        </span>
      </button>
      <p
        className={`text-[7px] uppercase pt-1 ${
          isActive ? "text-sky-300" : "text-black"
        }`}
      >
        {text}
      </p>
    </div>
  );
};

export default ToggleButton;
