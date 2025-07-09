"use client";

import React, { useEffect, useState } from "react";
import Header from "../io/Header";
import Footer from "../io/Footer";
import { useData } from "@/context/DataContext";
import { getRootOrg, getGroup, getAnnouncement } from "@/actions/QueueService";
import SlideMessage from "../io/SlideMessage";
import QueueItem from "./QueueItem";
import { useQueueTicket } from "@/context/QueueTicketContext";

type QueueMonitorProps = {
  group: string;
  children: React.ReactNode;
};

const Template = ({ children, group }: QueueMonitorProps) => {
  const [datas, setDatas] = useState<Record<string, any>>({});
  const { groups, general } = useData();
  const { blinkingTicket, ticketInfo, announcement, setAnnouncement } = useQueueTicket();

  const fetchData = async () => {
    let newConf = {};
    let name = general.lguname;
    if (name && name.length > 0) {
      newConf = { ...general };
    } else {
      const org = await getRootOrg();
      name = org.lgu.fullname;
      newConf = { ...general, lguname: name };
    }
    const groupInfo = await getGroup(group);
    newConf.title = groupInfo?.title;
    setDatas(newConf);
  };

  const fetchAnnouncement = async () => {
    try {
      const result = await getAnnouncement();
      setAnnouncement(result?.content || "");
    } catch (error) {
      console.error("Failed to fetch announcement:", error);
    }
  };

  const totalTickets = ticketInfo.length;
  const maxMain = Number(groups.windowCount);
  const reserveSlots = 5;

  // Determine how many go to main vs reserve
  let mainTickets: Record<string, any>[] = [];
  let reserveTickets: Record<string, any>[] = [];

  if (totalTickets > maxMain) {
    mainTickets = ticketInfo.slice(0, maxMain);
    reserveTickets = ticketInfo.slice(maxMain);
  } else {
    mainTickets = ticketInfo;
    reserveTickets = [];
  }

  // Pad reserve with empty slots to always show 4
  const paddedReserveTickets = Array.from(
    { length: reserveSlots },
    (_, index) => {
      return reserveTickets[index] || {}; // Fill with empty object if no ticket
    }
  );

  useEffect(() => {
    if (general.lguname !== "LGU name") {
      fetchData();
    }
    fetchAnnouncement();
  }, [general.lguname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header props={datas} color={groups.color} lgulogo={general.logoUrl} />
      <main
        className="flex-1"
        style={{
          backgroundColor: "",
          backgroundImage: groups.bgUrl ? `url(${groups.bgUrl})` : undefined,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: groups.bgSize,
        }}
      >
        {children}
      </main>

      {groups.showReserveTicket && (
        <div
          className={`grid grid-cols-5 w-full gap-5 px-5 pb-2 ${
            groups.showVideo ? "pt-5" : "pt-16"
          } ${groups.videoLayout === "standard" ? "pt-14" : ""}`}
        >
          <>
            {paddedReserveTickets.map((ticket, index) => (
              <QueueItem
                key={index}
                props={ticket || {}}
                className={`${ticket.ticketno ? "" : "opacity-50"} ${
                  ticket?.ticketno === blinkingTicket ? "blinking" : ""
                }`}
                height="70px"
                textSize="!text-3xl"
                borderLine="pt-8"
                counterCodeWidth="w-auto"
                hideSectionTitle
              />
            ))}
          </>
        </div>
      )}

      {announcement && (
        <div className="bg-gradient-to-b from-gray-100/80 to-gray-300/60 h-[60px] flex items-center justify-around">

            <SlideMessage
              message={
                typeof announcement === "object"
                  ? announcement?.content
                  : announcement
              }
              className="text-center w-full text-3xl"
              duration={100}
            />
     
        </div>
      )}

      <Footer color={groups.color} />
    </div>
  );
};

export default Template;
