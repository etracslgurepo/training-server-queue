import React from "react";
import { useBplsData } from "../../service/context/bplsdatas-context";
import Button from "../ui/Button";
import Flex from "../ui/Flex";
import FontFamilyPicker from "../ui/FontFamilyPicker";
import InputBox from "../ui/InputBox";
import Title from "../ui/Title";
import UploadImage from "../ui/UploadImage";

interface GeneralProps {
  title?: string;
}

const General: React.FC<GeneralProps> = ({ title }) => {
  const { bplsdata, updateLogoUrl, removeLogoUrl, handleSelect, handleSubmit, handleChange } = useBplsData();
  return (
    <div className="!text-lg">
      <Title text={title || "General"} className="text-start pb-5 text-xl" />
      <form onSubmit={handleSubmit}>
        <Flex className="gap-5 flex-col justify-center items-center">
          <FontFamilyPicker value={bplsdata.bpls.fontFamily} onChange={handleSelect} name={"fontFamily"} title="Font Style" />
          <div className="flex flex-col items-start justify-start">
            <Title text={"Logo"} className="text-start text-xl pl-4 leading-none" />
            <UploadImage onLogoUploaded={updateLogoUrl} removeLogoImage={removeLogoUrl} />
          </div>

          <InputBox label="LGU Name" name="lguname" value={bplsdata.bpls.lguname} onChange={handleChange} />

          <Button caption="Save" type="submit" className="px-5 m-0 text-[10px] absolute bottom-2 right-2 w-[60px] h-[25px] text-center flex items-center justify-center !rounded-md bg-blue-500 hover:bg-blue-600 text-white" />
        </Flex>
      </form>
    </div>
  );
};

export default General;
