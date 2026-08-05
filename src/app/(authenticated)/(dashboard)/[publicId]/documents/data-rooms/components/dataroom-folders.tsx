import { Button, Card } from "@hanzo/ui";
import { PageLayout } from "@/components/dashboard/page-layout";
import type { DataRoom } from "@prisma/client";
import {
  RiFolder3Fill as FolderIcon,
  RiMore2Fill as MoreIcon,
  RiAddFill,
} from "@remixicon/react";
import Link from "next/link";
import DataRoomPopover from "./data-room-popover";

interface DataRoomProps extends DataRoom {
  _count: {
    documents: number;
  };
}

type FolderProps = {
  companyPublicId: string;
  folders: DataRoomProps[];
};

const Folders = ({ companyPublicId, folders }: FolderProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "0.75rem" }}>
      <PageLayout
        title="Data room"
        description="A secure spaces to share multiple documents with investors, stakeholders and external parties."
        action={
          <DataRoomPopover
            trigger={
              <Button>
                <RiAddFill size={20} style={{ marginRight: "0.5rem" }} />
                Data room
              </Button>
            }
          />
        }
      />

      <hr style={{ margin: "0.75rem 0" }} />

      <Card
        style={{
          marginTop: "0.75rem",
          border: "none",
          background: "transparent",
          boxShadow: "none",
        }}
      >
        <ul className="folder-grid">
          {folders.map((folder) => (
            <li key={folder.id}>
              <Link
                href={`/${companyPublicId}/documents/data-rooms/${folder.publicId}`}
                className="folder-tile"
              >
                <div
                  className="center"
                  style={{
                    width: "3.5rem",
                    flexShrink: 0,
                    borderRadius: "0.375rem 0 0 0.375rem",
                    border: "1px solid var(--border)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  <FolderIcon
                    size={24}
                    style={{ color: "var(--primary)", opacity: 0.7 }}
                    aria-hidden="true"
                  />
                </div>
                <div
                  className="truncate"
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "0 0.375rem 0.375rem 0",
                    borderTop: "1px solid #e5e7eb",
                    borderBottom: "1px solid #e5e7eb",
                    borderRight: "1px solid #e5e7eb",
                    background: "#fff",
                  }}
                >
                  <div
                    className="truncate"
                    style={{
                      flex: 1,
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span className="folder-name">{folder.name}</span>
                    <p style={{ color: "#6b7280" }}>
                      {folder._count.documents === 1
                        ? `${folder._count.documents} file`
                        : `${folder._count.documents} files`}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0, paddingRight: "0.5rem" }}>
                    <button type="button" className="icon-btn">
                      <span className="sr-only">Open options</span>
                      <MoreIcon size={20} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Folders;
