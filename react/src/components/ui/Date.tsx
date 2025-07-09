// components/DateComponent.tsx
import React, { useEffect, useState } from "react";

interface DateComponentProps {
  className?: string;
  componentType?: string | undefined;
}

const DateComponent: React.FC<DateComponentProps> = ({
  className,
  componentType,
}) => {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit",
      };
      const formattedDate = now.toLocaleDateString("en-US", options);
      setCurrentDate(formattedDate);
    };

    // Update the date every second (for real-time display)
    const intervalId = setInterval(updateDate, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id={componentType}>
      <p className={`text-xl font-bold ${className}`}>{currentDate}</p>
    </div>
  );
};

export default DateComponent;
