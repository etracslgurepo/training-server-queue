import React from "react";
import { fontitem, FontFamily } from "../../stores/fontfamily-items";

interface FontFamilySelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  title?: string;
}

const FontFamilySelect: React.FC<FontFamilySelectProps> = ({
  value,
  onChange,
  name,
  title,
}) => {
  return (
    <div>
      <h1 className="text-center pb-1">{title}</h1>
      <select
        value={value}
        onChange={onChange}
        name={name}
        className="border border-blue-500 rounded"
      >
        {fontitem.map((font: FontFamily) => (
          <option key={font.id} value={font.family}>
            {font.id}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontFamilySelect;
