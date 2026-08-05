type OfficeViewerProps = {
  url: string;
};

const OfficeViewer = ({ url }: OfficeViewerProps) => {
  return (
    // biome-ignore lint/a11y/useIframeTitle: <explanation>
    <iframe
      src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url,
      )}`}
      style={{ width: "100%", height: "100%", minHeight: "100vh", border: 0 }}
    />
  );
};

export { OfficeViewer };
