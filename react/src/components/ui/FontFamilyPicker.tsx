import { FontFamily, fontitem } from "@/stores/fontFamilyItems";
import React from "react";


interface FontFamilySelectProps {
  value: string | undefined; // Allow value to be undefined
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
      <h1 className="text-center p-4">{title}</h1>
      <select
        value={value || "Arial"} // Use fallback value if undefined
        onChange={onChange}
        name={name}
        className="border border-blue-500 rounded"
        style={{
          fontFamily: value || "Arial"
        }}
      >
        {fontitem.map((font: FontFamily) => (
          <option key={font.id} value={font.family} style={{
            fontFamily: font.family
          }}>
            {font.id}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontFamilySelect;
