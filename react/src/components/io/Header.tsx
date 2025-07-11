import Image from "next/image";
import React from "react";
import Text from "../ui/Text";

const Header = ({props, color, lgulogo, fontFamily}:{props: any, color?: string, lgulogo?: string, fontFamily?: string}) => {
  const defaultLogo = "/images/lgu-logo.png";
  return (
    <div
      id={props.componentType}
      className="text-white text-center flex items-center justify-between px-5 py-[10px]"
      style={{
        backgroundColor: color,
        fontFamily: fontFamily
      }}
    > 
      <div>
        <Image
          src={lgulogo || defaultLogo}
          alt={"etracs logo"}
          width={80}
          height={80}
          priority
          unoptimized
          className="leading-none !p-0 !m-0"
        />
      </div>
      <div className="flex flex-col" style={{ fontFamily: props.fontfamily }}>
        <Text className="uppercase text-[32px] leading-[40px]">
          {props.title}
        </Text>
        <Text className="font-normal uppercase text-[24px] leading-[20px]">
          {props.lguname}
        </Text>
      </div>
      <div>
        <Image
          src={"/images/etracs.png"}
          alt={"etracs logo"}
          width={0}
          height={0}
          style={{ width: 120, height: 35 }}
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default Header;
