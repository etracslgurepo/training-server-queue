import React from "react";
import Time from "../ui/Time";
import DateComponent from "../ui/Date";


type TimeDateProps = {
  componentType: string | undefined;
  className?: string;
  fontFamily?: string;
};

const TimeDate: React.FC<TimeDateProps> = ({
  componentType,
  className,
  fontFamily,
}) => {
  return (
    <div
      id={componentType}
      className={`flex items-center justify-center gap-5 ${className}`}
      style={{ fontFamily: fontFamily }}
    >
      <Time />
      <div className="h-[20px] bg-black w-[2px]"></div>
      <DateComponent />
    </div>
  );
};

export default TimeDate;
