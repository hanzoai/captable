import { cn } from "@hanzo/ui";
import type { RiHome4Line } from "@remixicon/react";
import Link from "next/link";

type Icon = typeof RiHome4Line;

interface NavLinkProps {
  href?: string;
  icon?: Icon;
  name: string;
  active: boolean;
  className?: string;
}

export function NavLink({ active, href, icon, name, className }: NavLinkProps) {
  const Icon = icon;
  const cls = cn("nav-link", active && "active", className);
  const body = (
    <>
      {Icon && <Icon aria-hidden="true" />}
      {name}
    </>
  );

  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" className={cls}>
      {body}
    </button>
  );
}
