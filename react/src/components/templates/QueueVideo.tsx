"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import TimeDate from "../io/Time&Date";
import Weather from "../io/Weather";
import SlideMessage from "../io/SlideMessage";
import { useData } from "@/context/DataContext";
import { useQueueTicket } from "@/context/QueueTicketContext";

interface VideoProps {
  src?: string | null;
  controls?: boolean;
  componentType?: string | undefined;
  type?: string | undefined;
  layoutType?: "standard" | "info-panel";
  fontFamily?: string;
  videoLink: string;
  rowCount?: string | number;
}

const Video: React.FC<VideoProps> = ({
  src,
  controls = true,
  componentType,
  type,
  layoutType = "standard",
  fontFamily,
  videoLink,
  rowCount,
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [isLocalVideo, setIsLocalVideo] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { general, groups } = useData();
  const {announcement} = useQueueTicket();
  const [localVideoList, setLocalVideoList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const getAvailableLocalVideos = async (): Promise<string[]> => {
    const maxVideos = 10;
    const videoChecks = Array.from(
      { length: maxVideos },
      (_, i) => `/videos/video-${i + 1}.mp4`
    );

    const validVideos: string[] = [];

    for (const path of videoChecks) {
      try {
        const res = await fetch(path, { method: "HEAD" });
        if (res.ok) {
          validVideos.push(path);
        }
      } catch (err) {
        // Ignore if the file is missing
      }
    }

    return validVideos;
  };

  useEffect(() => {
    if (isLocalVideo) {
      getAvailableLocalVideos().then((videos) => {
        setLocalVideoList(videos);
      });
    }
  }, [isLocalVideo]);

  const handleEnded = () => {
    setCurrentIndex((prev) => {
      if (localVideoList.length === 0) return 0;
      return (prev + 1) % localVideoList.length;
    });
  };

  const datamessage = general.slidemessage;

  const parsedRowCount = Number(rowCount);

const bothAreTrue = groups?.showReserveTicket && announcement;
const oneIsTrue = groups?.showReserveTicket || announcement;
const rowHeight = layoutType === "standard" ? 127 : 116;

const videoHeight =
  parsedRowCount >= 6
    ? `${parsedRowCount * rowHeight }px`
    : layoutType === "standard"
    ? bothAreTrue
      ? "60vh"
      : oneIsTrue
      ? "65vh"
      : "75vh"
    : bothAreTrue
    ? "54vh"
    : oneIsTrue
    ? "60vh"
    : "68vh";




  useEffect(() => {
    if (datamessage) {
      const timeout = setTimeout(() => {
        setMessage(datamessage);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [datamessage]);

  useEffect(() => {
    const getVideoInfo = (
      url: string
    ): { platform: string; id: string | null; isLocal: boolean } => {
      if (!url) return { platform: "", id: null, isLocal: false };

      const youtubeRegExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const youtubeMatch = url.match(youtubeRegExp);
      if (youtubeMatch && youtubeMatch[2].length === 11) {
        return { platform: "youtube", id: youtubeMatch[2], isLocal: false };
      }

      const facebookRegExp =
        /(?:facebook\.com\/.*(?:video\.php\?v=|watch\/?\?v=|videos\/|video\/|watch\/v=)|fb\.watch\/)(\d+)/;
      const facebookMatch = url.match(facebookRegExp);
      if (facebookMatch && facebookMatch[1]) {
        return { platform: "facebook", id: facebookMatch[1], isLocal: false };
      }

      // If it starts with /videos/ or public path, treat as local
      if (
        url.startsWith("/videos/") ||
        url.endsWith(".mp4") ||
        url.endsWith(".webm")
      ) {
        return { platform: "local", id: null, isLocal: true };
      }

      return { platform: "", id: null, isLocal: false };
    };

    const videoData = getVideoInfo(videoLink || "");
    setPlatform(videoData.platform);
    setVideoId(videoData.id);
    setIsLocalVideo(videoData.isLocal);
  }, [videoLink]);

  const getEmbedUrl = () => {
    if (platform === "youtube") {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
    } else if (platform === "facebook") {
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/${videoId}/?autoplay=1&mute=1`;
    }
    return "";
  };

  if (componentType === "none") return null;

  const renderVideoElement = () => {
    if (isLocalVideo && localVideoList.length > 0) {
      return (
        <video
          key={currentIndex}
          ref={videoRef}
          src={localVideoList[currentIndex]}
          controls={controls}
          autoPlay
          muted
          loop={localVideoList.length === 1} // Loop only if it's just 1 video
          onEnded={localVideoList.length > 1 ? handleEnded : undefined} // Only change index if multiple
          className={`w-full h-full ${
            layoutType === "standard" ? "rounded-lg" : "rounded-t-lg"
          } shadow-[0_3px_6px_0_rgba(0,0,0,0.3)] bg-black`}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    if (videoId !== null) {
      return (
        <iframe
          src={getEmbedUrl()}
          title="Video player"
          className={`w-full h-full ${
            layoutType === "standard" ? "rounded-lg" : "rounded-t-lg"
          } shadow-[0_3px_6px_0_rgba(0,0,0,0.3)]`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <div className="w-full h-full aspect-video text-red-500 text-xl uppercase relative">
        <div className="absolute inset-0 flex items-end justify-center bottom-5">
          <span>No video link found</span>
        </div>
        <div className="w-full h-full rounded-lg bg-slate-600" />
      </div>
    );
  };

  return (
    <div
      id={componentType}
      className="flex flex-col items-center justify-between w-full gap-5 p-4"
    >
      {layoutType === "standard" ? (
        <div className="flex flex-col items-center justify-center w-full h-full gap-5">
          <div
            className="w-full max-w-7xl mx-auto"
            style={{ height: videoHeight }}
          >
            {renderVideoElement()}
          </div>
          <TimeDate
            componentType={undefined}
            className="mt-6"
            fontFamily={fontFamily}
          />
        </div>
      ) : (
        <div className="flex flex-col border border-gray-300 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
          <div className="w-full" style={{ height: videoHeight }}>
            {renderVideoElement()}
          </div>
          <div className="bg-white h-[70px] flex items-center justify-between px-20">
            <TimeDate componentType={undefined} />
            <div className="relative -top-[10px]">
              <Weather layout="layout-2" />
            </div>
          </div>
          <div className="bg-gray-200 h-[60px] rounded-b-md flex items-center justify-around px-10 relative">
            <div className="absolute overflow-hidden w-full">
              {/* SlideMessage component placeholder */}
              <SlideMessage message={message} className="text-center" duration={18000} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
