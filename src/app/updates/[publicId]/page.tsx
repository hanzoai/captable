import { Avatar, AvatarImage } from "@hanzo/ui";
import { dayjsExt } from "@/common/dayjs";
import { SharePageLayout } from "@/components/share/page-layout";
import UpdateRenderer from "@/components/update/renderer";
import { type JWTVerifyResult, decode } from "@/lib/jwt";
import { UpdateStatusEnum } from "@/prisma/enums";
import { db } from "@/server/db";
import { render } from "@react-email/components";
import { RiLock2Line } from "@remixicon/react";
import { notFound } from "next/navigation";
import { Fragment } from "react";

const PublicUpdatePage = async ({
  params: { publicId },
  searchParams: { token },
}: {
  params: { publicId: string };
  searchParams: { token: string };
}) => {
  let decodedToken: JWTVerifyResult | null = null;

  try {
    decodedToken = await decode(token);
  } catch (error) {
    console.error(error);
    return notFound();
  }

  const { payload } = decodedToken;

  if (
    payload.publicId !== publicId ||
    !payload.companyId ||
    !payload.recipientId
  ) {
    return notFound();
  }

  const update = await db.update.findFirst({
    where: {
      publicId,
      companyId: payload.companyId,
    },

    include: {
      company: {
        select: {
          name: true,
          logo: true,
        },
      },

      author: {
        select: {
          title: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!update) {
    return notFound();
  }

  const canRenderInPublic =
    update.status === UpdateStatusEnum.PUBLIC && update.public;

  if (!canRenderInPublic) {
    return (
      <div className="center" style={{ height: "100vh", width: "100%" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
        >
          <RiLock2Line size={40} />
          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#4b5563",
            }}
          >
            Public access denied
          </p>
        </div>
      </div>
    );
  }

  const recipients = await db.updateRecipient.findFirst({
    where: {
      id: payload.recipientId,
      updateId: update.id,
    },
  });

  if (!recipients) {
    return notFound();
  }

  const company = update?.company;
  const author = update?.author;
  const html = await render(<UpdateRenderer html={update.html} />);

  return (
    <SharePageLayout
      medium="updates"
      company={{
        name: company.name,
        logo: company.logo,
      }}
      title={
        <Fragment>
          <h1 className="auth-title">{update.title}</h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--muted-foreground)",
            }}
          >
            Last updated {dayjsExt().to(update.updatedAt)}
          </p>
        </Fragment>
      }
    >
      <Fragment>
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <Avatar
            style={{
              height: "2.5rem",
              width: "2.5rem",
              borderRadius: "9999px",
            }}
          >
            <AvatarImage src={author.user.image || "/placeholders/user.svg"} />
          </Avatar>

          <div>
            <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>
              {author.user.name}
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted-foreground)",
              }}
            >
              {author.title}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "1.25rem" }}>
          <article
            className="prose"
            //biome-ignore lint/security/noDangerouslySetInnerHtml: allow dangerouslySetInnerHtml
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </Fragment>
    </SharePageLayout>
  );
};

export default PublicUpdatePage;
