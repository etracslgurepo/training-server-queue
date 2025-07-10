import React from 'react'
import Text from "@/components/ui/Text";
import ImageUpload from '@/components/ui/UploadImage';
import ColorPicker from '@/components/ui/ColorPicker';
import { useData } from '@/context/DataContext';

const Theme = () => {
      const {
        groups,
        handleChange,
        handleBgSizeChange,
        updateBgUrl,
        removeBgUrl,
      } = useData();
        const selectedBgSize = groups.bgSize;


  return (
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
  )
}

export default Theme