import React from "react";
import FontFamilyPicker from "../ui/FontFamilyPicker";
import ImageUpload from "../ui/UploadImage";
import InputBox from "../ui/InputBox";
import Buzz from "../ui/Buzz";
import { useData } from "@/context/DataContext";

const General = () => {
  const { handleChange, handleSelect, updateLogoUrl, removeLogoUrl, general } =
    useData();
  return (
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
        {/* <InputBox
                  label="Marquee message in TV"
                  name="slidemessage"
                  value={general.slidemessage}
                  onChange={handleChange}
                  textArea
                /> */}
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
  );
};

export default General;
