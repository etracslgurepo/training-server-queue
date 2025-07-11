"use client";

import React, { useEffect, useState, useRef } from "react";
import TimeDate from "../io/Time&Date";
import Weather from "../io/Weather";
import SlideMessage from "../io/SlideMessage";
import { useData } from "@/context/DataContext";
import { useQueueTicket } from "@/context/QueueTicketContext";

interface VideoProps {
  videoLinks?: string[];
  controls?: boolean;
  componentType?: string;
  layoutType?: "standard" | "info-panel";
  fontFamily?: string;
  rowCount?: string | number;
}

const Video: React.FC<VideoProps> = ({
  videoLinks = [],
  controls = true,
  componentType,
  layoutType = "standard",
  fontFamily,
  rowCount,
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [isLocalVideo, setIsLocalVideo] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { general, groups } = useData();
  const { announcement } = useQueueTicket();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLink = videoLinks[currentIndex] || "";

  const datamessage = general.slidemessage;
  // const parsedRowCount = Number(rowCount);

  const bothAreTrue = groups?.showReserveTicket && announcement;
  const oneIsTrue = groups?.showReserveTicket || announcement;
  // const rowHeight = layoutType === "standard" ? 144 : 122;

const parsedRowCount = Number(rowCount) || 1;
const rowHeight = layoutType === "standard" ? 146 : 110;
const videoHeight = `${parsedRowCount * rowHeight}px`;


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

      const youtubeRegExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const youtubeMatch = url.match(youtubeRegExp);
      if (youtubeMatch && youtubeMatch[1]) {
        return { platform: "youtube", id: youtubeMatch[1], isLocal: false };
      }

      const facebookRegExp =
        /(?:facebook\.com\/.*(?:video\.php\?v=|videos\/|watch\/?\?v=)|fb\.watch\/)(\d+)/;
      const facebookMatch = url.match(facebookRegExp);
      if (facebookMatch && facebookMatch[1]) {
        return { platform: "facebook", id: facebookMatch[1], isLocal: false };
      }

 if (
  url.startsWith("/_custom/videos/") ||
  url.endsWith(".mp4") ||
  url.endsWith(".webm") ||
  url.startsWith("http://") || url.startsWith("https://")
) {
  const isLocal = url.endsWith(".mp4") || url.endsWith(".webm");
  return { platform: "local", id: null, isLocal };
}


      return { platform: "", id: null, isLocal: false };
    };

    const info = getVideoInfo(currentLink);
    setPlatform(info.platform);
    setVideoId(info.id);
    setIsLocalVideo(info.isLocal);
  }, [currentLink]);

  // 🔁 Advance to next video (looping)
  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videoLinks.length);
  };

  // 🧠 Inject YouTube player if needed
useEffect(() => {
    if (platform === "youtube" && videoId) {
      const existingScript = document.getElementById("youtube-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = "youtube-api";
        document.body.appendChild(tag);
      }

      const createPlayer = () => {
        new (window as any).YT.Player("yt-player", {
          events: {
            onStateChange: (event: any) => {
              if (event.data === 0 && videoLinks.length > 1) {
                nextVideo();
              }
            },
          },
        });
      };

      (window as any).onYouTubeIframeAPIReady = createPlayer;

      // If already loaded
      if ((window as any).YT && (window as any).YT.Player) {
        createPlayer();
      }
    }
  }, [videoId, platform]);

  

  useEffect(() => {
    let fbTimeout: NodeJS.Timeout;

    if (platform === "facebook") {
      fbTimeout = setTimeout(() => {
        if (videoLinks.length === 1) {
          setCurrentIndex(0); // Loop single FB video
        } else {
          nextVideo();
        }
      }, 30000); // Adjust duration as needed
    }

    return () => clearTimeout(fbTimeout);
  }, [currentIndex, platform]);

  const getEmbedUrl = () => {
    if (platform === "youtube" && videoId) {
      const loopParam =
        videoLinks.length === 1 ? `&loop=1&playlist=${videoId}` : "";
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1${loopParam}`;
    } else if (platform === "facebook" && videoId) {
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/${videoId}/?autoplay=1&mute=1`;
    }
    return "";
  };

  if (componentType === "none") return null;

  const renderVideoElement = () => {
    if (isLocalVideo) {
      return (
        <video
          key={currentIndex}
          ref={videoRef}
         src={
  currentLink.startsWith("http://") || currentLink.startsWith("https://")
    ? currentLink
    : `/_custom/videos/${currentLink}`
}

          controls={controls}
          autoPlay
          muted
          loop={videoLinks.length === 1}
          onEnded={videoLinks.length > 1 ? nextVideo : undefined}
          className={`w-full h-full ${
            layoutType === "standard" ? "rounded-lg" : "rounded-t-lg"
          } shadow-[0_3px_6px_0_rgba(0,0,0,0.3)] bg-black`}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    if ((platform === "youtube" || platform === "facebook") && videoId) {
      return (
        <iframe
          key={currentIndex}
          id={platform === "youtube" ? "yt-player" : undefined}
          src={getEmbedUrl()}
          title="Video player"
          className={`w-full h-full ${
            layoutType === "standard" ? "rounded-lg" : "rounded-t-lg"
          } shadow-[0_3px_6px_0_rgba(0,0,0,0.3)]`}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
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
        </div>
      ) : (
        <div className="flex flex-col border border-gray-300 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
          <div className="w-full" style={{ height: videoHeight }}>
            {renderVideoElement()}
          </div>
          <div className="bg-white h-[65px] flex items-center justify-between px-20">
            <TimeDate componentType={undefined} />
            <div className="relative -top-[10px]">
              <Weather layout="layout-2" />
            </div>
          </div>
          <div className="bg-gray-200 h-[55px] rounded-b-md flex items-center justify-around px-10 relative">
            <div className="absolute overflow-hidden w-full">
              <SlideMessage
                message={message}
                className="text-center"
                duration={18000}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;