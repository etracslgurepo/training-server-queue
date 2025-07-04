"use client";

import React from "react";

type PanelProps = {
  visibleWhen?: boolean;
  children?: React.ReactNode;
  className?: string;
};

const Panel: React.FC<PanelProps> = ({
  visibleWhen = true,
  children,
  className,
}) => {
  return <div className={`${className}`}>{visibleWhen ? children : null}</div>;
};

export default Panel;
