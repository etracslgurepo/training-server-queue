import React from "react";

interface MainPositionSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  vidLabel?: string;
  winLabel?: string;
}

export const VideoPosition: React.FC<MainPositionSelectProps> = ({
  value,
  onChange,
  name,
  vidLabel,
}) => {
  return (
    <div>
      <label
        htmlFor=""
        className="flex flex-col items-start justify-center leading-none pb-2"
      >
        <p className="leading-none text-lg pb-1">{vidLabel}</p>
        <select
          name={name}
          onChange={onChange}
          value={value}
          className="rounded border border-gray-500 w-48 focus:border-blue-500 focus:outline-none pl-1"
        >
          <option value="main-left">main-left</option>
          <option value="main-right">main-right</option>
        </select>
      </label>
    </div>
  );
};

export const WindowPosition: React.FC<MainPositionSelectProps> = ({
  value,
  onChange,
  name,
  winLabel,
}) => {
  return (
    <div>
      <label
        htmlFor=""
        className="flex flex-col items-start justify-center leading-none pb-2"
      >
        <p className="leading-none text-lg pb-1">{winLabel}</p>
        <select
          name={name}
          onChange={onChange}
          value={value}
          className="rounded border border-gray-500 w-48 focus:border-blue-500 focus:outline-none pl-1"
        >
          <option value="main-left">main-left</option>
          <option value="main-right">main-right</option>
        </select>
      </label>
    </div>
  );
};
