import React from 'react'
import Text from "@/components/ui/Text";
import InputBox from '@/components/ui/InputBox';
import { VideoPosition } from '@/components/ui/Position';
import VideoLayout from '@/components/ui/VideoLayout';
import ToggleButton from '@/components/ui/ToggleButton';
import { useData } from '@/context/DataContext';

const Video = () => {
      const {
        groups,
        handleSubmit,
        handleChange,
        handleSelect,
        handlePositionChange,
        handleBgSizeChange,
        toggleReserveTicket,
        toggleVideo,
        updateBgUrl,
        removeBgUrl,
        resetData,
        setGroupId,
        groupId,
        updateVideoUrls,
      } = useData();

      const getHeightClass = (length: number): string => {
  const base = 350;
  const step = 150;
  const extraHeight = Math.floor((length - 2) / 2) * step;
  const clampedHeight = Math.min(base + extraHeight, 1000); // max height if needed
  return `h-[${clampedHeight}px]`;
};

const heightClass = getHeightClass(groups.videoUrl?.length || 0);

  return (
     <div className="border-r border-black/20">
                <div className="w-full text-center pt-5">
                  <Text className="inline-block font-semibold text-xl uppercase p-0 border-b-2 border-black/50">
                    Video
                  </Text>
                </div>
                <div
                  className={`p-5 ${heightClass} w-full flex flex-col items-center justify-center gap-2`}
                >
                  <div className="flex flex-col gap-2 w-full items-center justify-center">
                    {groups.videoUrl?.map((url: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-center gap-2"
                      >
                        <InputBox
                          label={`video-url ${index + 1}`}
                          type="text"
                          name={`videoUrl[${index}]`}
                          value={url}
                          onChange={(e) => {
                            const newLinks = [...groups.videoUrl];
                            newLinks[index] = e.target.value;
                            updateVideoUrls(newLinks);
                          }}
                          className="h-6 w-52 text-center"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...groups.videoUrl];
                            updated.splice(index, 1);
                            updateVideoUrls(updated);
                          }}
                          className="px-2 py-1 mt-3 bg-red-500 text-white rounded text-[12px]"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateVideoUrls([...(groups.videoUrl || []), ""])
                    }
                    className="mt-2 px-3 py-1 text-[12px] bg-blue-500 text-white rounded hover:bg-blue-400 transition"
                  >
                    + Add New Video
                  </button>
                  <div className="flex gap-5">
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
                  <ToggleButton
                    isActive={groups.showVideo}
                    onClick={toggleVideo}
                    caption="Video Visibility"
                    text={groups.showVideo ? "Hide Video" : "Show Video"}
                  />
                </div>
              </div>
  )
}

export default Video