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
  videoUrl: ["https://www.youtube.com/watch?v=x2gi5nLZFwY"],
  videoposition: "main-left",
  videoLayout: "standard",
  windowposition: "main-right",
  xyAxis: "vertical",
  rowCount: "5",
  columnCount: "1",
  windowCount: "5",
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

  useEffect(() => {
    fetchData(currentGroupId);
  }, [currentGroupId]);

  const fetchData = (groupId: string) => {
    fetch("/api/data/getData")
      .then((response) => response.json())
      .then((data) => {
        if (data.group) {
          const groupData = data.group.find((g: GroupData) => g.id === groupId);
     if (groupData) {
  setGroups({
    ...groupData,
    videoUrl: Array.isArray(groupData.videoUrl)
      ? groupData.videoUrl
      : groupData.videoUrl
      ? [groupData.videoUrl]
      : [""],
  });
}

        } else {
          console.error("Groups data is undefined");
        }

        if (data.general) {
          setGeneral(data.general);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
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
    try {
      const response = await fetch("/api/data/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group: groups,
          general: general,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Updated data:", result);
      } else {
        console.error("Error updating data:", result);
      }
    } catch (error) {
      console.error("Error saving data:", error);
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
    const defaultGroup = createDefaultGroup(currentGroupId);
    setGroups(defaultGroup);
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
