import { ChangeEvent, useState, forwardRef, ForwardedRef } from "react";

interface NumberInputProps {
  value?: number | null;
  placeholder?: string;
  label?: string;
  className?: string;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

const NumberInput: React.ForwardRefRenderFunction<
  HTMLInputElement,
  NumberInputProps
> = ({ value = 0, onChange, placeholder, label, className, disabled }, ref) => {
  const [inputValue, setInputValue] = useState<string>(
    value !== null ? value.toString() : ""
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!isNaN(parseFloat(newValue)) && onChange) {
      onChange(parseFloat(newValue));
    }
  };

  return (
    <label htmlFor="">
      <p className="leading-none text-[12px] text-center">{label}</p>
      <input
        ref={ref}
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`text-center text-[12px] placeholder:text-[13px] placeholder:text-slate-600 uppercase rounded-sm text-black ${className}`}
        disabled={disabled}
      />
    </label>
  );
};

export default forwardRef(NumberInput);
