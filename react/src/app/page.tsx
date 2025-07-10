"use client";

import Sidebar from "@/components/templates/Sidebar";
import Button from "@mui/material/Button";
import ColorPicker from "@/components/ui/ColorPicker";
import FontFamilyPicker from "@/components/ui/FontFamilyPicker";
import InputBox from "@/components/ui/InputBox";
import { VideoPosition, WindowPosition } from "@/components/ui/Position";
import ToggleButton from "@/components/ui/ToggleButton";
import ImageUpload from "@/components/ui/UploadImage";
import XyAxis from "@/components/ui/XyAxis";
import { useData } from "@/context/DataContext";
import { lookupService } from "@/lib/client";
import { ReactElement, useEffect, useState } from "react";
import Text from "@/components/ui/Text";
import VideoLayout from "@/components/ui/VideoLayout";
import CircularProgress from "@mui/material/CircularProgress";
import General from "@/components/settings/General";
import Theme from "@/components/settings/modules/Theme";
import Window from "@/components/settings/modules/Window";
import Video from "@/components/settings/modules/Video";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<ReactElement | null>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const svc = lookupService("QueueService");
  const {
    groups,
    handleSubmit,
    resetData,
    setGroupId,
    groupId,
  } = useData();

  const fetchGroups = async () => {
    const res = await svc?.invoke("getQueueGroup");
    setData(res);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupChange = (groupId: string) => {
    setGroupId(groupId);
  };

  const handleItemClick = (item: ReactElement) => {
    setSelectedItem(item);
    fetchGroups();
  };

  const selectedGroup = data.find(
    (group) => group.objid.toLowerCase() === groupId
  );

const getHeightClass = (length: number): string => {
  const base = 350;
  const step = 150;
  const extraHeight = Math.floor((length - 2) / 2) * step;
  const clampedHeight = Math.min(base + extraHeight, 1000); // max height if needed
  return `h-[${clampedHeight}px]`;
};

const heightClass = getHeightClass(groups.videoUrl?.length || 0);



  return (
    <div className="relative flex min-h-screen">
      <Sidebar
        onItemClick={handleItemClick}
        items={data}
        handleGroupChange={handleGroupChange}
      />

      <div className="w-full p-4 bg-gray-200 pl-12">
        <Text className="text-xl">
          {selectedGroup?.title || "No Group Selected"}
        </Text>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
              await handleSubmit(e); // this must return a Promise
            } catch (err) {
              console.error("Save failed:", err);
            } finally {
              setLoading(false);
            }
          }}
        >
          {groupId !== "gen" ? (
            <div className="grid grid-cols-2 auto-cols-fr items-center w-full border border-black rounded mt-5 p-5">
              <Theme />
              <Window />
              <Video />
              <div className="border-l h-full border-black/20">
                <div className="w-full text-center pt-5">
                  <Text className="inline-block font-semibold text-xl uppercase p-0 border-b-2  text-transparent">
                   {/* 4th cont title */} title
                  </Text>
                </div>
                <div
                  className={`p-5 ${heightClass} w-[233px] flex flex-col items-center justify-center gap-2`}
                >
                  {/* 4th cont */}
                </div>
              </div>
            </div>
          ) : null}

          {groupId === "gen" ? (
           <General />
          ) : null}

          <div className="absolute top-4 right-4">
            <div className="flex gap-x-5">
              <Button onClick={resetData} variant="outlined">
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={
                  loading ? <CircularProgress size={20} thickness={5} /> : null
                }
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
