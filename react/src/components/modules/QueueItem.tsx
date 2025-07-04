import React from "react";
import Number from "../ui/Number";

export type QueueItemProps = {
  ticketno?: string;
  countercode: string;
  bgColor?: React.CSSProperties;
  fontFamily?: string;
  className?: string;
};

const QueueItem: React.FC<QueueItemProps> = ({ countercode, ticketno, bgColor, fontFamily, className }) => {
  const itemStyle: React.CSSProperties = {
    ...(bgColor && {
      ...bgColor,
      backgroundColor: `${bgColor.backgroundColor} !important`,
    }),
  };

  return (
    <div className={`${className}`}>
      <div className={` ${className}`}>
        <div className="bg-white rounded-xl shadow-md border-2 p-2" style={bgColor}>
          <div className="flex flex-row h-20 max-md:h-16 gap-x-2" style={{ fontFamily: fontFamily }}>
            <div className="flex flex-col justify-center items-center text-center p-1">
              <Number number={countercode} className="~text-lg/5xl" />
            </div>
            <div className="border border-black border-solid m-2"></div>
            <div className="flex flex-col justify-center items-center text-center w-full" style={itemStyle}>
              <Number number={ticketno} className={`~text-lg/5xl`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueItem;
