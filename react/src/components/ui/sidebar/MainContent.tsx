import React from "react";
import General from "../../groups/General";

interface MainContentProps {
  selectedItem: React.ReactElement | null; // Adjusted type
}

const MainContent: React.FC<MainContentProps> = ({ selectedItem }) => {
  return (
    <div className="w-[80%] h-screen relative bg-gray-200">
      <div className="p-4 pl-20">
        {selectedItem ? selectedItem : <General />}
      </div>
    </div>
  );
};

export default MainContent;
