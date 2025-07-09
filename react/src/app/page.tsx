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
import Buzz from "@/components/ui/Buzz";
import VideoLayout from "@/components/ui/VideoLayout";
import CircularProgress from "@mui/material/CircularProgress";


export default function Home() {
  const [selectedItem, setSelectedItem] = useState<ReactElement | null>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const svc = lookupService("QueueService");
  const {
    groups,
    handleSubmit,
    handleChange,
    handleSelect,
    handlePositionChange,
    handleBgSizeChange,
    toggleReserveTicket,
    toggleVideo,
    updateLogoUrl,
    updateBgUrl,
    removeLogoUrl,
    removeBgUrl,
    resetData,
    setGroupId,
    groupId,
    general,
    removeVideoUrl,
  } = useData();
  const selectedBgSize = groups.bgSize;

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
              <div className="border-r border-b-2 border-black/20">
                <div className="w-full text-center">
                  <Text className="inline-block font-semibold text-xl uppercase p-0 border-b-2 border-black/50">
                    Theme
                  </Text>
                </div>
                <div className=" p-5 h-[350px] w-full flex flex-col items-center justify-center">
                  <div>
                    <ImageUpload
                      onLogoUploaded={updateBgUrl}
                      removeLogoImage={removeBgUrl}
                      title="Background Image"
                      imgUrl={groups.bgUrl}
                    />
                    <div className="">
                      <Text className="text-center font-normal text-lg pb-1">
                        Background Position
                      </Text>
                      <div className="flex w-full gap-2">
                        <div
                          className={`!p-0 !m-0 text-[10px] w-[30%] h-[25px] text-center flex items-center justify-center !rounded-md border border-black/50 cursor-pointer ${
                            selectedBgSize === "contain"
                              ? "bg-blue-500 text-white border-none"
                              : "bg-gray-200"
                          }`}
                          onClick={() => handleBgSizeChange("contain")}
                        >
                          contain
                        </div>
                        <div
                          className={`!p-0 !m-0 text-[10px] w-[30%] h-[25px] text-center flex items-center justify-center !rounded-md border border-black/50 cursor-pointer ${
                            selectedBgSize === "cover"
                              ? "bg-blue-500 text-white border-none"
                              : "bg-gray-200"
                          }`}
                          onClick={() => handleBgSizeChange("cover")}
                        >
                          cover
                        </div>
                        <div
                          className={`!p-0 !m-0 text-[10px] w-[30%] h-[25px] text-center flex items-center justify-center !rounded-md border border-black/50 cursor-pointer ${
                            selectedBgSize === "auto"
                              ? "bg-blue-500 text-white border-none"
                              : "bg-gray-200"
                          }`}
                          onClick={() => handleBgSizeChange("auto")}
                        >
                          auto
                        </div>
                      </div>
                    </div>
                    <ColorPicker
                      name={"color"}
                      value={groups.color}
                      onChange={handleChange}
                      label="Header & Footer Color"
                    />
                  </div>
                </div>
              </div>
              <div className="border-l border-b-2 border-black/20">
                <div className="w-full text-center">
                  <Text className="inline-block font-semibold text-xl uppercase p-0 border-b-2 border-black/50">
                    Window
                  </Text>
                </div>

                <div className=" p-5 h-[350px] w-full flex flex-col items-center justify-center">
                  <div className="flex gap-5">
                    <InputBox
                      label="Number of Windows"
                      type="number"
                      name="windowCount"
                      value={groups.windowCount}
                      onChange={handleChange}
                      className="h-6 w-28 text-center"
                    />
                    <XyAxis
                      value={groups.xyAxis}
                      onChange={handleSelect}
                      name="xyAxis"
                      label="Window Orientation"
                    />
                  </div>
                  <div className="flex gap-5">
                    <InputBox
                      label="Columns Count"
                      name="columnCount"
                      type="number"
                      value={groups.columnCount}
                      onChange={handleChange}
                    />

                    <InputBox
                      label="Rows Count"
                      name="rowCount"
                      type="number"
                      value={groups.rowCount}
                      onChange={handleChange}
                    />
                  </div>
                  <WindowPosition
                    value={groups.windowposition}
                    onChange={(e) =>
                      handlePositionChange("windowposition", e.target.value)
                    }
                    name="windowposition"
                    winLabel="Window Position"
                  />
                  <ToggleButton
                    isActive={groups.showReserveTicket}
                    onClick={toggleReserveTicket}
                    caption="Reserve Ticket Visibility"
                    text={
                      groups.showReserveTicket
                        ? "Hide ReserveTicket"
                        : "Show ReserveTicket"
                    }
                  />
                </div>
              </div>
              <div className="border-r border-black/20">
                <div className="w-full text-center">
                  <Text className="inline-block font-semibold text-xl uppercase p-0 border-b-2 border-black/50">
                    Video
                  </Text>
                </div>
                <div className=" p-5 h-[350px] w-full flex flex-col items-center justify-center gap-2">
                  <ToggleButton
                    isActive={groups.showVideo}
                    onClick={toggleVideo}
                    caption="Video Visibility"
                    text={groups.showVideo ? "Hide Video" : "Show Video"}
                  />
                  <div className="flex flex-col items-center">
                    <InputBox
                      label="URL"
                      type="text"
                      name="videoUrl"
                      value={groups.videoUrl}
                      onChange={handleChange}
                      className="h-6 w-28 text-center"
                    />
                    <div
                      onClick={removeVideoUrl}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition duration-200 text-[12px] cursor-pointer"
                    >
                      Remove
                    </div>
                  </div>
                  <VideoPosition
                    value={groups.videoposition}
                    onChange={(e) =>
                      handlePositionChange("videoposition", e.target.value)
                    }
                    name={"videoposition"}
                    vidLabel="Video Position"
                  />
                  <VideoLayout
                    value={groups.videoLayout}
                    onChange={handleSelect}
                    name="videoLayout"
                    label="Video Layout"
                  />
                </div>
              </div>
              <div className="border-l border-black/20">
                <div className="w-full text-center">
                  <Text className="inline-block font-semibold text-xl uppercase p-0 border-b-2  text-transparent">
                    Video
                  </Text>
                </div>
                <div className=" p-5 h-[350px] w-[233px] flex flex-col items-center justify-center gap-2">
                  {/* 4th cont */}
                </div>
              </div>
            </div>
          ) : null}

          {groupId === "gen" ? (
            <div className="grid grid-cols-2 auto-cols-fr w-full border border-black rounded mt-5 p-5">
              <div className="border-r border-b-2 border-black/20 = p-5 h-[350px] flex flex-col items-center justify-center gap-5">
                <FontFamilyPicker
                  value={general.fontFamily || "Arial"}
                  onChange={handleSelect}
                  name={"fontFamily"}
                  title="Font Style"
                />
                <ImageUpload
                  onLogoUploaded={updateLogoUrl}
                  removeLogoImage={removeLogoUrl}
                  title="Upload Logo"
                  imgUrl={general.logoUrl}
                />
              </div>
              <div className="border-l border-b-2 border-black/20 = p-5 h-[350px] flex flex-col items-center justify-center gap-5">
                <InputBox
                  label="LGU Name"
                  name="lguname"
                  value={general.lguname}
                  onChange={handleChange}
                  textArea
                />
                <InputBox
                  label="Marquee message in TV"
                  name="slidemessage"
                  value={general.slidemessage}
                  onChange={handleChange}
                  textArea
                />
              </div>
              <div className="border-r border-black/20 = p-5 h-[350px] w-auto flex flex-col items-center justify-center gap-5">
                <Buzz
                  value={general.buzz}
                  onChange={handleSelect}
                  name={"buzz"}
                  label="Buzz Sound"
                />
              </div>
              <div className="border-l border-black/20 = p-5 h-[350px] w-auto flex flex-col items-center justify-center gap-5">
                {/* 4th content */}
              </div>
            </div>
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
