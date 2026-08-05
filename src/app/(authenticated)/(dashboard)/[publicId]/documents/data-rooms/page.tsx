import { Button } from "@hanzo/ui";
import EmptyState from "@/components/common/empty-state";
import { getServerComponentAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { RiAddFill, RiFolderCheckFill } from "@remixicon/react";
import { Fragment } from "react";
import DataRoomPopover from "./components/data-room-popover";
import Folders from "./components/dataroom-folders";

const getDataRooms = (companyId: string) => {
  return db.dataRoom.findMany({
    where: {
      companyId,
    },

    include: {
      _count: {
        select: { documents: true },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const DataRoomPage = async () => {
  const session = await getServerComponentAuthSession();

  if (!session || !session.user) {
    return null;
  }

  const { companyId, companyPublicId } = session.user;
  const dataRooms = await getDataRooms(companyId);

  return (
    <Fragment>
      {dataRooms.length > 0 ? (
        <Folders companyPublicId={companyPublicId} folders={dataRooms} />
      ) : (
        <Fragment>
          <EmptyState
            icon={<RiFolderCheckFill />}
            title="You don't have any data rooms yet."
            subtitle="A secure spaces to share multiple documents with investors, stakeholders and external parties."
          >
            <DataRoomPopover
              trigger={
                <Button>
                  <RiAddFill size={20} style={{ marginRight: "0.5rem" }} />
                  Create a data room
                </Button>
              }
            />
          </EmptyState>
        </Fragment>
      )}
    </Fragment>
  );
};

export default DataRoomPage;
