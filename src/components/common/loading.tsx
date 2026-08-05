import { LogoIcon } from "@/components/common/icons";

const Loading = () => {
  return (
    <div
      className="center"
      style={{
        position: "absolute",
        inset: 0,
        background: "rgb(255 255 255 / 0.5)",
      }}
    >
      <div className="center" style={{ height: "100vh" }}>
        <div style={{ position: "relative", display: "inline-flex" }}>
          <LogoIcon
            className="animate-pulse"
            style={{ height: "2rem", width: "2rem" }}
          />
          <div
            className="animate-ping"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "2rem",
              width: "2rem",
              borderRadius: "9999px",
              background: "var(--primary)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
