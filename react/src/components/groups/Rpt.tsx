import React, { useState } from "react";
import { useRptData } from "../../service/context/rptdata-context";
import Button from "../ui/Button";
import Buzz from "../ui/Buzz";
import ColorPicker from "../ui/ColorPicker";
import Flex from "../ui/Flex";
import InputBox from "../ui/InputBox";
import { VideoPosition, WindowPosition } from "../ui/MainConPosition";
import Title from "../ui/Title";
import ToggleButton from "../ui/ToggleBtn";
import UploadImage from "../ui/UploadImage";
import XyAxis from "../ui/XyAxis";

interface RptProps {
  title?: string;
}

const Rpt: React.FC<RptProps> = ({ title }) => {
  const { rptdata, handleChange, handleSubmit, handleSelect, toggleVideo, updateBgUrl, removeBgUrl, updateBgSize, resetData, setRptData } = useRptData();

  const [selectedBgSize, setSelectedBgSize] = useState<"auto" | "contain" | "cover">(rptdata.rpt.bgSize);

  const handleBgSizeChange = (bgSize: "auto" | "contain" | "cover") => {
    updateBgSize(bgSize);
    setSelectedBgSize(bgSize);
  };

  const handlePositionChange = (name: string, value: string) => {
    if (name === "windowposition") {
      const newVideoPosition = value === "main-left" ? "main-right" : "main-left";
      setRptData({
        ...rptdata,
        rpt: {
          ...rptdata.rpt,
          windowposition: value,
          videoposition: newVideoPosition,
        },
      });
    } else if (name === "videoposition") {
      const newWindowPosition = value === "main-left" ? "main-right" : "main-left";
      setRptData({
        ...rptdata,
        rpt: {
          ...rptdata.rpt,
          videoposition: value,
          windowposition: newWindowPosition,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Title text={title || ""} className="text-start pb-5 text-xl" />
      <Flex className="flex-col items-start gap-1">
        <Title text={"Theme"} className="text-start font-semibold text-xl" />
        <ColorPicker name={"color"} value={rptdata.rpt.color} onChange={handleChange} label="" />
        <div>
          <Title text={"Window"} className="text-start pb-2 font-semibold text-xl" />
          <div className="flex gap-5 justify-center item-center pl-5">
            <InputBox label="Number of Windows" type="number" name="windowCount" value={rptdata.rpt.windowCount} onChange={handleChange} className="h-6 w-28 text-center" />
            {/* <ColorPicker name={"windowColor"} value={rptdata.rpt.windowColor} onChange={handleChange} label="window color" /> */}
          </div>
        </div>
        <div className="flex gap-5 pl-5">
          <div className="flex flex-col">
            <Title text={"Window Position"} className="text-start font-normal text-xl" />
            <XyAxis value={rptdata.rpt.xyAxis} onChange={handleSelect} name={"xyAxis"} label="" />

            <WindowPosition value={rptdata.rpt.windowposition} onChange={(e) => handlePositionChange("windowposition", e.target.value)} name="windowposition" winLabel="" />
          </div>
          <div className="invisible">
            <Title text={"X & Y axis"} className="text-start font-normal text-xl" />
            <InputBox
              label=""
              type="number"
              name="verticalRowsCount"
              value={rptdata.rpt.showVideo === false || rptdata.rpt.windowposition === "vertical" ? 5 : 0 || rptdata.rpt.showVideo === true || rptdata.rpt.windowposition === "vertical" ? 2 : 0}
              onChange={handleChange}
              className={`h-6 w-28 text-center ${rptdata.rpt.xyAxis === "horizontal" ? "bg-gray-400 opacity-50 border-none" : ""}`}
              disabled
            />

            <InputBox
              label=""
              type="number"
              name="horizontalColsCount"
              value={rptdata.rpt.showVideo === false || rptdata.rpt.windowposition === "horizontal" ? 2 : 0 || rptdata.rpt.showVideo === true || rptdata.rpt.windowposition === "horizontal" ? 2 : 0}
              onChange={handleChange}
              className={`h-6 w-28 text-center ${rptdata.rpt.xyAxis === "vertical" ? "bg-gray-400 opacity-50 border-none" : ""}`}
              disabled={rptdata.rpt.xyAxis === "vertical" || rptdata.rpt.showVideo === false}
            />
          </div>
        </div>
        <Title text={"Video"} className="text-start font-semibold text-xl" />
        <div className="flex gap-5 pl-5">
          <div>
            <InputBox label="URL" type="text" name="videoUrl" value={rptdata.rpt.videoUrl} onChange={handleChange} className="h-6 w-28 text-center" />
            <VideoPosition value={rptdata.rpt.videoposition} onChange={(e) => handlePositionChange("videoposition", e.target.value)} name={"videoposition"} vidLabel="Position" />
          </div>
          <div>
            <ToggleButton isActive={rptdata.rpt.showVideo} onClick={toggleVideo} caption={"Visibility "} text={rptdata.rpt.showVideo ? "Hide Video" : "Show Video"} />
            <Buzz value={rptdata.rpt.buzz} onChange={handleSelect} name={"buzz"} label="Buzz Sound" />
          </div>
        </div>
        <div>
          <Title text="Background" className="text-start pt-3 font-semibold text-xl" />
          <div className="flex flex-col pl-5">
            <div className="flex items-center justify-center gap-5">
              <Title text="Image" className="text-start font-normal text-xl" />
              <UploadImage onLogoUploaded={updateBgUrl} removeLogoImage={removeBgUrl} title="" />
            </div>

            <Flex className=" gap-5 w-full items-start justify-start">
              <Title text="Position" className="text-start font-normal text-xl" />
              <div className="flex w-full gap-2">
                <Button caption="contain" className={`!p-0 !m-0 text-[10px] w-[30%] h-[25px] text-center flex items-center justify-center !rounded-md ${selectedBgSize === "contain" ? "bg-gray-400" : ""}`} onClick={() => handleBgSizeChange("contain")} />
                <Button caption="cover" className={`!p-0 !m-0 text-[10px] w-[30%] h-[25px] text-center flex items-center justify-center !rounded-md ${selectedBgSize === "cover" ? "bg-gray-400" : ""}`} onClick={() => handleBgSizeChange("cover")} />
                <Button caption="auto" className={`!p-0 !m-0 text-[10px] w-[30%] h-[25px] text-center flex items-center justify-center !rounded-md ${selectedBgSize === "auto" ? "bg-gray-400" : ""}`} onClick={() => handleBgSizeChange("auto")} />
              </div>
            </Flex>
          </div>
        </div>
        <Flex className="gap-10 absolute bottom-10 left-20">
          <Button caption="Reset" className="px-5 m-0 text-[10px] w-[60px] h-[25px] text-center flex items-center justify-center !rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800" onClick={resetData} />
          <Button caption="Save" type="submit" className="px-5 m-0 text-[10px] w-[60px] h-[25px] text-center flex items-center justify-center !rounded-md bg-blue-500 hover:bg-blue-600 text-white" />
        </Flex>
      </Flex>
    </form>
  );
};

export default Rpt;
