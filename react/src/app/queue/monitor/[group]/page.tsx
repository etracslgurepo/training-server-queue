"use client";
import QueueMonitor from "@/components/templates/QueueMonitor";
import Template from "@/components/templates/Template";
import { DataProvider, useData } from "@/context/DataContext";
import { lookupService } from "@/lib/client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const Page = ({ params }: { params: { group: string } }) => {
  const { group } = params;
  const { general } = useData();
  const svc = lookupService("QueueService");
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await svc?.invoke("getQueueGroup");
      setData(res || []);
      setLoading(false);
    };

    fetchGroups();
  }, []);

  if (loading) return null; // Or show a loader/spinner

  const matchedGroup = data.find((item) => item.objid.toLowerCase() === group);

  if (!matchedGroup) {
notFound();
  }

  return (
    <div style={{ fontFamily: general.fontFamily }}>
      <DataProvider groupId={group}>
        <Template group={group}>
          <QueueMonitor group={group} />
        </Template>
      </DataProvider>
    </div>
  );
};

export default Page;
