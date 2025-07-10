import React from "react";
import QueueItem from "./QueueItem";
import Text from "@/components/ui/Text";
import TimeDate from "../io/Time&Date";
import { useData } from "@/context/DataContext";

const QueueGroup = ({
  props,
  classname,
  componentType,
  orientation,
  columnCount = 1,
  rowCount = 4,
  windowCount = 4,
  blinkingTicket,
}: {
  props: Record<string, any>[];
  classname?: string;
  componentType?: string | undefined;
  orientation: "vertical" | "horizontal" | string;
  columnCount?: number | string;
  rowCount?: number | string;
  windowCount?: number | string;
  blinkingTicket?: string;
}) => {

  const {general} = useData()

  const numColumnCount = Number(columnCount);
  const numRowCount = Number(rowCount);
  const numWindowCount = Number(windowCount);

  const maxSlots = numColumnCount * numRowCount;

  if (numWindowCount > maxSlots) {
    console.warn(
      `⚠️ windowCount (${numWindowCount}) exceeds the available slots (${maxSlots}). Some windows won't be shown.`
    );
  }

  // Prepare only up to numWindowCount tickets
  const filledTickets: Record<string, any>[] = Array.from(
    { length: Math.min(numWindowCount, maxSlots) },
    (_, i) => props[i] || {}
  );

  // Orientation transformation
  let displayTickets: Record<string, any>[] = [];

  if (orientation === "vertical") {
    const actualRows = numRowCount;
    for (let row = 0; row < actualRows; row++) {
      for (let col = 0; col < numColumnCount; col++) {
        const index = col * actualRows + row;
        if (index < filledTickets.length) {
          displayTickets.push(filledTickets[index]);
        }
      }
    }
  } else {
    displayTickets = filledTickets;
  }

  const containerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${numColumnCount}, minmax(0, 1fr))`,
    gap: "1rem",
  };


  return (
    <div id={componentType} className="w-full">
      {/* <Text className="text-[32px] leading-6 absolute top-[90px] pt-4 !font-bold uppercase text-start">
        now serving
      </Text> */}
      <div className="flex items-center justify-between px-1">
  <Text className="text-[30px] !font-bold uppercase" >
        now serving
      </Text>
      <TimeDate
            componentType={undefined}
            className=""
            fontFamily={general.fontFamily}
          />
      </div>
      
      <div style={containerStyle} className={`${classname} pt-[10px]`}>
        {displayTickets.map((ticket, index) => (
          <QueueItem
            key={index}
            props={ticket}
         blinkingTicket={ticket?.ticketno === blinkingTicket ? "blinking" : ""}          />
        ))}
      </div>
    </div>
  );
};

export default QueueGroup;
