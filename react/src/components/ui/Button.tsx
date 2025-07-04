import React, { useState } from "react";
import Link from "next/link";

function Button({
  caption,
  onClick,
  href,
  className,
  children,
  display,
  value,
  icon,
  componentType,
  type,
  disabled,
}: {
  caption?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  children?: React.ReactNode;
  display?: string;
  value?: string;
  icon?: React.ReactNode;
  componentType?: string;
  type?: "submit" | "button" | "reset" | undefined;
  disabled?: boolean | undefined;
}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 350);
  };

  if (href) {
    return (
      <Link
        href={href}
        className={`text-2xl px-20 py-4 rounded-xl border border-gray-400 uppercase ${display} ${className}`}
      >
        {caption}
      </Link>
    );
  }

  return (
    <button
      id={componentType}
      className={`text-2xl px-20 py-4 rounded-xl border border-gray-400 uppercase ${className} ${display} ${
        clicked ? "transform scale-90 transition-transform duration-300" : ""
      }`}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      {icon}
      {caption}
      {children}
    </button>
  );
}

export default Button;
