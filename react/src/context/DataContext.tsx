'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

interface GroupData {
  id: string;
  color: string;
  showReserveTicket: boolean;
  showVideo: boolean;
  videoUrl: string[];
  videoposition: string;
  videoLayout: "standard" | "info-panel";
  windowposition: string;
  xyAxis: string;
  rowCount: string | number;
  columnCount: string | number;
  windowCount: string | number;
  bgUrl: string;
  bgSize: "auto" | "contain" | "cover";
}

interface GeneralData {
  logoUrl: string;
  fontFamily: string;
  lguname: string;
  slidemessage: string;
  buzz: string;
}

interface DataContextValue {
  groups: GroupData;
  general: GeneralData;
  updateBgSize: (bgSize: "auto" | "contain" | "cover") => void;
  updateLogoUrl: (logoUrl: string) => void;
  removeLogoUrl: () => void;
  updateBgUrl: (bgUrl: string) => void;
  removeBgUrl: () => void;
  removeVideoUrl: () => void;
  updateVideoUrls: (urls: string[]) => void;
  handleBgSizeChange: (bgSize: "auto" | "contain" | "cover") => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handlePositionChange: (name: string, value: string) => void;
  toggleReserveTicket: () => void;
  toggleVideo: () => void;
  resetData: () => void;
  groupId: string;
  setGroupId: (groupId: string) => void;
}

interface DataProviderProps {
  children: React.ReactNode;
  groupId?: string;
}

const createDefaultGroup = (id: string): GroupData => ({
  id,
  color: "#335F96",
  showReserveTicket: false,
  showVideo: true,
  videoUrl: ["http://192.168.2.15:2180/videos/sample.mp4"],
  videoposition: "main-left",
  videoLayout: "standard",
  windowposition: "main-right",
  xyAxis: "vertical",
  rowCount: "3",
  columnCount: "1",
  windowCount: "3",
  bgUrl: "",
  bgSize: "auto",
});

const defaultGeneral: GeneralData = {
  logoUrl: "/images/lgu-logo.png",
  fontFamily: "Arial",
  lguname: "LGU name",
  slidemessage: "",
  buzz: "/sound/take_number_sound.mp3",
};

const DataContext = createContext<DataContextValue>({
  groups: createDefaultGroup("tc"),
  general: defaultGeneral,
  updateLogoUrl: () => {},
  removeLogoUrl: () => {},
  updateBgSize: () => {},
  updateBgUrl: () => {},
  removeBgUrl: () => {},
  removeVideoUrl: () => {},
  updateVideoUrls: () => {},
  handleBgSizeChange: () => {},
  handleChange: () => {},
  handleSelect: () => {},
  handleSubmit: () => {},
  handlePositionChange: () => {},
  toggleReserveTicket: () => {},
  toggleVideo: () => {},
  resetData: () => {},
  groupId: "tc",
  setGroupId: () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<DataProviderProps> = ({ children, groupId = "gen" }) => {
  const [groups, setGroups] = useState<GroupData>(createDefaultGroup("tc"));
  const [general, setGeneral] = useState<GeneralData>(defaultGeneral);
  const [currentGroupId, setCurrentGroupId] = useState(groupId);
  const [defaultTheme, setDefaultTheme] = useState<GroupData>(createDefaultGroup("default"));

  useEffect(() => {
    fetchData(currentGroupId);
  }, [currentGroupId]);

  const fetchData = async (groupId: string) => {
    try {
      const res = await fetch("/api/data/getData", { cache: "no-store" });
      const data = await res.json();

      const fetchedDefaultTheme = data.defaultTheme || createDefaultGroup(groupId);
      setDefaultTheme(fetchedDefaultTheme);
      
      const override = data.groups?.find((g: GroupData) => g.id === groupId) || {};

      const mergedGroup = {
        ...fetchedDefaultTheme,
        ...override,
        id: groupId,
        videoUrl: Array.isArray(override.videoUrl)
          ? override.videoUrl
          : override.videoUrl
          ? [override.videoUrl]
          : fetchedDefaultTheme.videoUrl,
      };

      setGroups(mergedGroup);
      setGeneral(data.general || defaultGeneral);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    if (name === "logoUrl" || name === "lguname" || name === "slidemessage") {
      setGeneral((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setGroups((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "fontFamily" || name === "buzz") {
      setGeneral((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setGroups((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePositionChange = (name: string, value: string) => {
    if (name === "windowposition") {
      const newVideoPosition = value === "main-left" ? "main-right" : "main-left";
      setGroups((prev) => ({
        ...prev,
        windowposition: value,
        videoposition: newVideoPosition,
      }));
    } else if (name === "videoposition") {
      const newWindowPosition = value === "main-left" ? "main-right" : "main-left";
      setGroups((prev) => ({
        ...prev,
        videoposition: value,
        windowposition: newWindowPosition,
      }));
    }
  };

  const handleBgSizeChange = (bgSize: "auto" | "contain" | "cover") => {
    setGroups((prev) => ({
      ...prev,
      bgSize,
    }));
  };

  const updateVideoUrls = (urls: string[]) => {
    setGroups((prev) => ({
      ...prev,
      videoUrl: urls,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

    // Compare against the actual defaultTheme from the server, not the hardcoded one
    const groupOverrides: Partial<GroupData> = { id: currentGroupId };
    
    // Only include properties that differ from defaultTheme
    Object.entries(groups).forEach(([key, value]) => {
      if (key !== "id" && !isEqual(defaultTheme[key as keyof GroupData], value)) {
        (groupOverrides as any)[key] = value;
      }
    });

    // Always send the complete group data - the backend will handle the cleanup
    const completeGroupData = { ...groups };

    try {
      const res = await fetch("/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          groups: completeGroupData, // Send complete data
          general 
        }),
      });

      const result = await res.json();
      if (res.ok) {
        console.log("Updated successfully");
        // Refetch to get the cleaned up data
        fetchData(currentGroupId);
      } else {
        console.error("Update failed:", result);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const toggleReserveTicket = () => {
    setGroups((prev) => ({
      ...prev,
      showReserveTicket: !prev.showReserveTicket,
    }));
  };

  const toggleVideo = () => {
    setGroups((prev) => ({
      ...prev,
      showVideo: !prev.showVideo,
    }));
  };

  const updateLogoUrl = (logoUrl: string) => {
    setGeneral((prev) => ({
      ...prev,
      logoUrl,
    }));
  };

  const removeLogoUrl = () => {
    setGeneral((prev) => ({
      ...prev,
      logoUrl: "",
    }));
  };

  const updateBgUrl = (bgUrl: string) => {
    setGroups((prev) => ({
      ...prev,
      bgUrl,
    }));
  };

  const removeBgUrl = () => {
    setGroups((prev) => ({
      ...prev,
      bgUrl: "",
    }));
  };

  const removeVideoUrl = () => {
    setGroups((prev) => ({
      ...prev,
      videoUrl: [""],
    }));
  };

  const updateBgSize = (bgSize: "auto" | "contain" | "cover") => {
    setGroups((prev) => ({
      ...prev,
      bgSize,
    }));
  };

  const resetData = () => {
    // Use the actual defaultTheme from server instead of hardcoded default
    setGroups({ ...defaultTheme, id: currentGroupId });
    setGeneral({
      ...defaultGeneral,
      lguname: "",
    });
  };

  const setGroupId = (groupId: string) => {
    setCurrentGroupId(groupId);
  };

  return (
    <DataContext.Provider
      value={{
        groups,
        general,
        updateBgSize,
        updateLogoUrl,
        removeLogoUrl,
        updateBgUrl,
        removeBgUrl,
        removeVideoUrl,
        updateVideoUrls,
        handleChange,
        handleSelect,
        handleSubmit,
        handlePositionChange,
        handleBgSizeChange,
        toggleReserveTicket,
        toggleVideo,
        resetData,
        groupId: currentGroupId,
        setGroupId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};