// components/SlideMessage.tsx
import Marquee from "react-fast-marquee";

type SlideMessageProps = {
  message: string;
  duration?: number;
  className?: string;
};

const SlideMessage = ({
  message,
  className,
  duration = 5000,
}: SlideMessageProps) => {

  const color = ""

  return (
    <Marquee speed={duration} gradientWidth={100} gradient gradientColor="#f3f4f6cc">
      <h1 className={`${className}`}>{message}</h1>
    </Marquee>
  );
};

export default SlideMessage;
