"use client";

import { Button, Input, Label, Popover, PopoverContent, PopoverTrigger } from "@hanzo/ui";
import Loading from "@/components/common/loading";
import { api } from "@/trpc/react";
import { RiArrowRightLine as ArrowRightIcon } from "@remixicon/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DataRoomPopoverType = {
  trigger: React.ReactNode;
};

const DataRoomPopover = ({ trigger }: DataRoomPopoverType) => {
  const router = useRouter();
  const { data } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const companyPublicId = data?.user.companyPublicId;

  const dataRoomMutation = api.dataRoom.save.useMutation({
    onSuccess: (response) => {
      if (response.success) {
        router.push(
          `/${companyPublicId}/documents/data-rooms/${response.data?.publicId}`,
        );
      } else {
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },

    onSettled: () => {
      setLoading(false);
      router.refresh();
    },
  });

  const saveDataRoom = async () => {
    setLoading(true);
    await dataRoomMutation.mutateAsync({ name });
  };

  return (
    <Popover>
      {loading && <Loading />}
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent style={{ width: "20rem" }}>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          onSubmit={async (e) => {
            e.preventDefault();
            await saveDataRoom();
          }}
        >
          <Label htmlFor="data-room-name">Data room name</Label>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--muted-foreground)",
            }}
          >
            Start by giving your data room a name.
          </p>
          <Input
            id="data-room-name"
            style={{ height: "2rem" }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button size="sm" variant={"secondary"} type="submit">
              Continue
              <ArrowRightIcon size={16} style={{ marginLeft: "0.5rem" }} />
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DataRoomPopover;
