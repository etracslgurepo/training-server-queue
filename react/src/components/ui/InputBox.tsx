import React from "react";

type InputBox = {
  type?: string;
  name?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  textArea?: boolean;
};

const InputBox: React.FC<InputBox> = ({
  type,
  name,
  value,
  onChange,
  label,
  className,
  disabled,
  textArea = false
}) => {
  return (
    <div>
      <label
        htmlFor=""
        className="flex flex-col items-start justify-center leading-none pb-2"
      >
        <p className="leading-none text-lg pb-1">{label}</p>
        {
          textArea ? (
            <textarea name={name} value={value as string} onChange={onChange}     className={`border border-gray-500 w-48 h-[100px] rounded p-1 focus:border-blue-500 focus:outline-none ${className}`} />
          ) : (
            <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`border border-gray-500 w-48 rounded p-1 focus:border-blue-500 focus:outline-none ${className}`}
            disabled={disabled}
          />

          )
        }
      
       
      </label>
    </div>
  );
};

export default InputBox;
