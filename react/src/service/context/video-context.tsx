// video-context.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { openDB, saveToDB, getValue } from "../utils/IndexedDB";

export interface VideoProviderProps {
  children: React.ReactNode;
}

export interface VideoContextType {
  showVideo: boolean;
  videoUpload: string | null;
  savedShowVideo: boolean;
  toggleVideo: () => void;
  handleVideoUpload: (video: string) => void;
}

const initialVideoState: VideoContextType = {
  showVideo: true,
  videoUpload: null,
  savedShowVideo: true,
  toggleVideo: () => {},
  handleVideoUpload: () => {},
};

export const VideoContext = createContext<VideoContextType>(initialVideoState);

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [savedShowVideo, setSavedShowVideo] = useState<boolean>(true);
  const [videoUpload, setVideoUpload] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const db = await openDB();
        const transaction = db.transaction(["settings"], "readonly");
        const store = transaction.objectStore("settings");

        const showVideoValue = await getValue(store, "showVideo");
        setShowVideo(showVideoValue !== undefined ? showVideoValue : true);

        const savedShowVideoValue = await getValue(store, "savedShowVideo");
        setSavedShowVideo(
          savedShowVideoValue !== undefined ? savedShowVideoValue : true
        );

        const savedVideoUpload = await getValue(store, "videoUpload");
        setVideoUpload(
          savedVideoUpload !== undefined ? savedVideoUpload : null
        );
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, []);

  const toggleVideo = () => {
    const newShowVideo = !showVideo;
    setShowVideo(newShowVideo);
    setSavedShowVideo(newShowVideo);
    saveToDB("settings", "showVideo", newShowVideo);
  };

  const handleVideoUpload = (video: string) => {
    setVideoUpload(video);
    saveToDB("settings", "videoUpload", video);
  };

  return (
    <VideoContext.Provider
      value={{
        showVideo,
        savedShowVideo,
        toggleVideo,
        handleVideoUpload,
        videoUpload,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};
