"use client";


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@hanzo/ui";
import { cn } from "@hanzo/ui";

type DonutSelectorProps = {
  selected: string;
  onChange: (value: string) => void;
  className?: string;
};

const DonutSelector: React.FC<DonutSelectorProps> = ({
  selected,
  onChange,
  className,
}) => {
  return (
    <Select
      value={selected}
      onValueChange={async (newValue) => {
        if (newValue !== selected) {
          onChange(newValue);
        }
      }}
    >
      <SelectTrigger
        className={cn(className)}
        style={{
          marginLeft: "-0.5rem",
          height: "1.25rem",
          width: 133,
          cursor: "pointer",
          borderRadius: "0.25rem",
          border: "none",
          background: "transparent",
          fontWeight: 600,
          color: "var(--primary)",
          textDecoration: "underline",
        }}
      >
        <SelectValue placeholder="Select the type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="share-class">Share classes</SelectItem>
        <SelectItem value="stakeholder">Stakeholders</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DonutSelector;
