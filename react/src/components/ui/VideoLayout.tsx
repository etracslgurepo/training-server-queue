import React from "react";

interface VideoLayoutSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  label?: string;
  disabled?: boolean;
}

const VideoLayout: React.FC<VideoLayoutSelectProps> = ({
  value,
  onChange,
  name,
  label,
  disabled
}) => {
  return (
    <div>
      <label
        htmlFor=""
        className="flex flex-col items-start justify-center leading-none pb-2"
      >
        <p className={`leading-none text-lg pb-1  ${disabled === true ? "opacity-50 text-gray-500": ""}`}>{label}</p>
        <select
          name={name}
          onChange={onChange}
          value={value}
          className={`rounded border border-gray-500 w-48 focus:border-blue-500 focus:outline-none pl-1 ${disabled === true ? "opacity-30 text-gray-500": ""}`}
          disabled={disabled}
        >
          <option value="standard">Standard</option>
          <option value="info-panel">Info Panel</option>
        </select>
      </label>
    </div>
  );
};

export default VideoLayout;
