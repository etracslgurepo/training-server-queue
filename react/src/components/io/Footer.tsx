import React from "react";
import Text from "../ui/Text";

type FooterProps = {
  componentType?: string | undefined;
  fontfamily?: string;
  color?: string;
};

const Footer: React.FC<FooterProps> = ({ componentType, fontfamily, color }) => {
  return (
    <div id={componentType} style={{ fontFamily: fontfamily, backgroundColor: color }} >
      <Text className="text-[22px] p-2 text-center text-white">
 etracsQueue is a complete enterprise software system for customer queue management.
      </Text>
      
    </div>
  );
};

export default Footer;
