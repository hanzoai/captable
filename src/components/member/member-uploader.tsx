"use client";

import { Button } from "@hanzo/ui";
import { parseInviteMembersCSV } from "@/lib/invite-team-members-csv-parser";
import { api } from "@/trpc/react";
import type { TypeZodInviteMemberArrayMutationSchema } from "@/trpc/routers/member-router/schema";
import { RiUploadLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type TeamMemberUploaderType = {
  setOpen: (val: boolean) => void;
};

const TeamMemberUploader = ({ setOpen }: TeamMemberUploaderType) => {
  const [csvFile, setCSVFile] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const inviteMember = api.member.inviteMember.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast.success("You have successfully invited the stakeholder.");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files ?? []);
    setCSVFile(files);
  };

  const onImport = async () => {
    try {
      if (!csvFile[0]) {
        return;
      }

      const parsedData = (await parseInviteMembersCSV(
        csvFile[0],
      )) as TypeZodInviteMemberArrayMutationSchema;
      await Promise.all(
        parsedData.map(async (data) => {
          await inviteMember.mutateAsync(data);
        }),
      );
      setOpen(false);
    } catch (error) {
      console.error((error as Error).message);
      toast.error(
        "Something went wrong, please check the CSV file and make sure its according to our format",
      );
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div
        style={{
          fontSize: "0.875rem",
          lineHeight: "1.5rem",
          color: "#525252",
        }}
      >
        Please download the{" "}
        <Link
          download
          href="/sample-csv/captable-team-members-template.csv"
          target="_blank"
          rel="noopener noreferrer"
          className="pill-link"
        >
          <span style={{ marginRight: "0.25rem" }}>sample csv file</span>
          <span aria-hidden="true"> &darr;</span>
        </Link>
        , complete and upload it to import your existing or new team members.
      </div>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div className="upload-drop" onClick={() => fileInputRef.current?.click()}>
        <RiUploadLine size={28} />
        <span style={{ fontSize: "0.875rem" }}>
          {csvFile.length !== 0 ? csvFile[0]?.name : "Click here to import"}
        </span>
        <input
          onChange={onFileInputChange}
          type="file"
          ref={fileInputRef}
          accept=".csv"
          hidden
        />
      </div>

      <div style={{ fontSize: "0.75rem" }}>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={""}
          style={{ color: "#0f766e", textDecoration: "underline" }}
        >
          Learn more
        </Link>{" "}
        about the sample csv format
      </div>

      <Button onClick={onImport} style={{ marginLeft: "auto", display: "block" }}>
        Import
      </Button>
    </div>
  );
};

export default TeamMemberUploader;
