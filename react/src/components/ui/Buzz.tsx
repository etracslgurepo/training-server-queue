import React from "react";

interface BuzzSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  label?: string;
}

const Buzz: React.FC<BuzzSelectProps> = ({ value, onChange, name, label }) => {
  return (
    <div>
      <label
        htmlFor=""
        className="flex flex-col items-center justify-center leading-none pb-2"
      >
        <p className="leading-none text-lg pb-1">{label}</p>
        <select
          name={name}
          onChange={onChange}
          value={value}
          className="rounded border border-gray-500 w-48 focus:border-blue-500 focus:outline-none"
        >
          <option value="/sound/buzz1.mp3">buzz 1</option>
          <option value="/sound/buzz2.mp3">buzz 2</option>
          <option value="/sound/buzz3.mp3">buzz 3</option>
          <option value="/sound/buzz4.mp3">buzz 4</option>
        </select>
      </label>
    </div>
  );
};

export default Buzz;
