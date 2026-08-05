"use client";

import { Avatar, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@hanzo/ui";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

type UserDropdownProps = {
  companyPublicId: string;
};

export function UserDropdown({ companyPublicId }: UserDropdownProps) {
  const { data } = useSession();
  const name = data?.user.name;
  const email = data?.user.email;
  const image = data?.user.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          style={{
            position: "relative",
            height: "2rem",
            width: "2rem",
            borderRadius: "9999px",
          }}
        >
          <Avatar
            style={{
              height: "2.25rem",
              width: "2.25rem",
              borderRadius: "9999px",
            }}
          >
            <AvatarImage src={image || "/placeholders/user.svg"} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ width: "14rem" }} align="end" forceMount>
        <DropdownMenuLabel style={{ fontWeight: 400 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", fontWeight: 500, lineHeight: 1 }}>
              {name}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                lineHeight: 1,
                color: "var(--muted-foreground)",
              }}
            >
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/${companyPublicId}/settings/profile`}>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/${companyPublicId}/settings/billing`}>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/${companyPublicId}/settings/notifications`}>
            <DropdownMenuItem>
              Notifications
              <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
        >
          Sign out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
