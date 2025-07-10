import React from 'react'
import Text from "@/components/ui/Text";
import InputBox from '@/components/ui/InputBox';
import XyAxis from '@/components/ui/XyAxis';
import { WindowPosition } from '@/components/ui/Position';
import ToggleButton from '@/components/ui/ToggleButton';
import { useData } from '@/context/DataContext';

const Window = () => {
      const {
        groups,
        handleChange,
        handleSelect,
        handlePositionChange,
        toggleReserveTicket,
      } = useData();
      
  return (
    <div className="border-l border-b-2 border-black/20">
                <div className="w-full text-center">
                  <Text className="inline-block font-semibold text-xl uppercase p-0 border-b-2 border-black/50">
                    Window
                  </Text>
                </div>

                <div className=" p-5 h-[350px] w-full flex flex-col items-center justify-center">
                  <div className="flex gap-5">
                    <InputBox
                      label="Number of Windows"
                      type="number"
                      name="windowCount"
                      value={groups.windowCount}
                      onChange={handleChange}
                      className="h-6 w-28 text-center"
                    />
                    <XyAxis
                      value={groups.xyAxis}
                      onChange={handleSelect}
                      name="xyAxis"
                      label="Window Orientation"
                    />
                  </div>
                  <div className="flex gap-5">
                    <InputBox
                      label="Columns Count"
                      name="columnCount"
                      type="number"
                      value={groups.columnCount}
                      onChange={handleChange}
                    />

                    <InputBox
                      label="Rows Count"
                      name="rowCount"
                      type="number"
                      value={groups.rowCount}
                      onChange={handleChange}
                    />
                  </div>
                  <WindowPosition
                    value={groups.windowposition}
                    onChange={(e) =>
                      handlePositionChange("windowposition", e.target.value)
                    }
                    name="windowposition"
                    winLabel="Window Position"
                  />
                  <ToggleButton
                    isActive={groups.showReserveTicket}
                    onClick={toggleReserveTicket}
                    caption="Reserve Ticket Visibility"
                    text={
                      groups.showReserveTicket
                        ? "Hide ReserveTicket"
                        : "Show ReserveTicket"
                    }
                  />
                </div>
              </div>
  )
}

export default Window