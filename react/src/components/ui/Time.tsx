import React, { useState, useEffect } from "react";

interface TimeProps {
  format?: string;
  className?: string;
  componentType?: string | undefined;
}

const Time: React.FC<TimeProps> = ({
  format = "hh:mm A",
  className,
  componentType,
}) => {
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(intervalId);
  });

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const isPM = hours >= 12;
    const displayHours = hours % 12 || 12; // Convert to 12-hour format

    const minutes = now.getMinutes().toString().padStart(2, "0");

    const ampm = isPM ? "PM" : "AM";

    return format
      .replace("hh", displayHours.toString().padStart(2, "0"))
      .replace("mm", minutes)
      .replace("A", ampm);
  }

  return (
    <div id={componentType} className={`font-bold text-xl ${className}`}>
      {currentTime}
    </div>
  );
};

export default Time;
