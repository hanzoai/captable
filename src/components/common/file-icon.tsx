"use client";
import { fileType } from "@/lib/mime";

import {
  RiFileCloudFill,
  RiFileExcelFill,
  RiFileImageFill,
  RiFileMusicFill,
  RiFilePdf2Fill,
  RiFilePptFill,
  RiFileVideoFill,
  RiFileWordFill,
} from "@remixicon/react";

type FileIconProps = {
  type: string;
};

const icons: Record<
  string,
  { Icon: typeof RiFileCloudFill; bg: string; fg: string }
> = {
  image: { Icon: RiFileImageFill, bg: "#fce7f3", fg: "#ec4899" },
  audio: { Icon: RiFileMusicFill, bg: "#e0e7ff", fg: "#6366f1" },
  video: { Icon: RiFileVideoFill, bg: "#ffe4e6", fg: "#f43f5e" },
  powerpoint: { Icon: RiFilePptFill, bg: "#ffedd5", fg: "#f97316" },
  doc: { Icon: RiFileWordFill, bg: "#dbeafe", fg: "#3b82f6" },
  excel: { Icon: RiFileExcelFill, bg: "#d1fae5", fg: "#10b981" },
  pdf: { Icon: RiFilePdf2Fill, bg: "#fee2e2", fg: "#ef4444" },
};

const fallback = { Icon: RiFileCloudFill, bg: "#dbeafe", fg: "#3b82f6" };

const FileIcon = ({ type }: FileIconProps) => {
  const { Icon, bg, fg } = icons[fileType(type)] ?? fallback;

  return (
    <div
      className="center"
      style={{
        height: "2rem",
        width: "2rem",
        borderRadius: "0.375rem",
        background: bg,
      }}
    >
      <Icon size={20} style={{ color: fg }} />
    </div>
  );
};

export default FileIcon;
