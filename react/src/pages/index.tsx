import { ReactElement, useState } from "react";
import MainContent from "../components/ui/sidebar/MainContent";
import Sidebar from "../components/ui/sidebar/Sidebar";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<ReactElement | null>(null); // Adjusted type

  const handleItemClick = (item: ReactElement) => {
    setSelectedItem(item);
  };
  return (
    <div className="flex">
      <Sidebar onItemClick={handleItemClick} />
      <MainContent selectedItem={selectedItem} />
    </div>
  );
}
