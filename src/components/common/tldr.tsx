import { RiInformationLine } from "@remixicon/react";
import Link from "next/link";

type TldrProps = {
  message: string;
  cta?: {
    label: string;
    href: string;
  };
};

const Tldr = ({ message, cta }: TldrProps) => {
  return (
    <div
      style={{
        marginTop: "0.75rem",
        borderRadius: "0.375rem",
        background: "#f0fdfa",
        padding: "1rem",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ flexShrink: 0 }}>
          <RiInformationLine
            size={20}
            style={{ color: "#0d9488" }}
            aria-hidden="true"
          />
        </div>
        <div style={{ marginLeft: "0.75rem" }}>
          <div style={{ fontSize: "0.875rem", color: "#0d9488" }}>
            <p>{message}</p>
          </div>

          {cta && (
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  margin: "-0.375rem -0.5rem",
                  display: "flex",
                }}
              >
                <Link
                  passHref
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tldr-cta"
                >
                  <span style={{ marginRight: "0.25rem" }}>{cta.label}</span>
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tldr;
