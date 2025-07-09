import React from "react";

interface XyAxisSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  label?: string;
  disabled?: boolean;
}

const XyAxis: React.FC<XyAxisSelectProps> = ({
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
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </label>
    </div>
  );
};

export default XyAxis;
