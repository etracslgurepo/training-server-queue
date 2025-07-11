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
  const {
    blinkingTicket,
    ticketInfo,
    announcement,
    setAnnouncement,
  } = useQueueTicket();

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

  const visibleWindowCount = Number(groups.windowCount || groups.rowCount || 0);
  const totalTickets = ticketInfo.length;

  const mainTickets = ticketInfo.slice(0, visibleWindowCount);
  const reserveTickets = ticketInfo.slice(visibleWindowCount);

const paddedReserveTickets = Array.from(
  { length: reserveTickets.length },
  (_, index) => reserveTickets[index]
);


// const reserveSlots = Math.max(reserveTickets.length, 3); // Minimum 3 reserve slots
// const paddedReserveTickets = Array.from(
//   { length: reserveSlots },
//   (_, index) => reserveTickets[index] || {}
// );


  useEffect(() => {
    if (general.lguname !== "LGU name") {
      fetchData();
    }
    fetchAnnouncement();
  }, [general.lguname]);

  return (
    <div className="flex flex-col h-screen">
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

      {reserveTickets.length > 0 && (
        <div
          className={`grid grid-cols-5 w-full gap-5 px-5 pb-2 ${
            groups.showVideo ? "pt-5" : "pt-16"
          } ${groups.videoLayout === "standard" ? "pt-14" : ""}`}
        >
          {paddedReserveTickets.map((ticket, index) => (
            <QueueItem
              key={index}
              props={ticket || {}}
              className={`${ticket.ticketno ? "" : "opacity-50"}`}
              height="70px"
              textSize="!text-3xl"
              borderLine="pt-8"
              counterCodeWidth="w-auto"
              hideSectionTitle
              blinkingTicket={`${
                ticket?.ticketno === blinkingTicket ? "blinking" : ""
              }`}
            />
          ))}
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
