import { Card } from "@hanzo/ui";
import FileIcon from "@/components/common/file-icon";
import type { Bucket } from "@prisma/client";
import Link from "next/link";

type DocumentExplorerProps = {
  shared?: boolean;
  jwtToken?: string;
  companyPublicId: string;
  dataRoomPublicId: string;
  documents: Bucket[];
};

const DataRoomFileExplorer = ({
  jwtToken,
  shared,
  documents,
  companyPublicId,
  dataRoomPublicId,
}: DocumentExplorerProps) => {
  return (
    <Card
      style={{ border: "none", background: "transparent", boxShadow: "none" }}
    >
      <ul className="folder-grid">
        {documents.map((document) => (
          <li key={document.id}>
            <Link
              href={
                shared
                  ? `/data-rooms/${dataRoomPublicId}/${document.id}?token=${jwtToken}`
                  : `/${companyPublicId}/documents/${document.id}`
              }
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
                <FileIcon type={document.mimeType} />
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
                  style={{ flex: 1, padding: "0.5rem 1rem" }}
                >
                  <span className="folder-name">{document.name}</span>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{`${
                    document.mimeType
                  } - ${(document.size / 1024 / 1024).toFixed(2)} MB`}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default DataRoomFileExplorer;
