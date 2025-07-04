import Image from "next/image";
import React, { useEffect, useState } from "react";
import SubTitle from "../ui/SubTitle";
import TimeDate from "../ui/Time&Date";

interface VideoProps {
  src?: string | null;
  controls?: boolean;
  componentType?: string | undefined;
  type?: string | undefined;
  layoutType?: "default" | "custom";
  fontFamily?: string;
  videoLink: string;
}

const Video: React.FC<VideoProps> = ({ src, controls = true, componentType, type, layoutType = "default", fontFamily, videoLink }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    const getVideoId = (url: string): { platform: string; id: string | null } => {
      const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const youtubeMatch = url.match(youtubeRegExp);
      if (youtubeMatch && youtubeMatch[2].length === 11) {
        return { platform: "youtube", id: youtubeMatch[2] };
      }

      const facebookRegExp = /(?:facebook\.com\/.*(?:video\.php\?v=|watch\/?\?v=|videos\/|video\/|watch\/v=)|fb\.watch\/)(\d+)/;
      const facebookMatch = url.match(facebookRegExp);
      if (facebookMatch && facebookMatch[1]) {
        return { platform: "facebook", id: facebookMatch[1] };
      }

      return { platform: "", id: null };
    };

    const videoData = getVideoId(videoLink);
    setVideoId(videoData.id);
    setPlatform(videoData.platform);
    console.log(`Platform: ${videoData.platform}, Video ID: ${videoData.id}`);
  }, [videoLink]);

  const getEmbedUrl = () => {
    if (platform === "youtube") {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    } else if (platform === "facebook") {
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/${videoId}/?autoplay=1&mute=1`;
    }
    return "";
  };
  return (
    <div id={componentType}>
      {layoutType === "default" ? (
        <div className=" flex flex-col items-center justify-center gap-5">
          <div className="w-full max-w-3xl mx-auto">
            {videoId !== null ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe src={getEmbedUrl()} title="Video player" width="770" height="430" className="rounded-xl shadow-[0_3px_6px_0_rgba(0,0,0,0.3)]" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 text-red-500 text-2xl uppercase">video not found</div>
            )}
          </div>

          <TimeDate componentType={undefined} className="bg-gray-200 bg-opacity-50 rounded px-2" fontFamily={fontFamily} />
        </div>
      ) : (
        <div className="flex flex-col border border-gray-300 rounded-lg shadow-lg ">
          <div className="w-full max-w-3xl mx-auto">
            {videoId !== null ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe src={getEmbedUrl()} title="Video player" allowFullScreen width="770" height="430" className="rounded-t-xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9"></div>
            )}
          </div>
          <div className="absolute right-2 top-2 bg-gray-200 bg-opacity-50 rounded px-2">
            <TimeDate componentType={undefined} />
          </div>

          <div className="bg-white h-[70px] flex items-center justify-between px-20">
            <Image src={"/images/etracs-logo.png"} alt={"etracs logo"} width={130} height={130} quality={100} />
            <div className="bg-[#0a5366] rounded-lg p-2">
              <Image src={"/images/rameses-logo.png"} alt={"etracs logo"} width={110} height={110} quality={100} />
            </div>
          </div>
          <div className="bg-gray-200 h-[60px] rounded-b-md flex items-center justify-center">
            <SubTitle text="QueueEtracs is a complete enterprise software system for customer queue management system" className="text-[15px] p-2 text-center font-normal" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
