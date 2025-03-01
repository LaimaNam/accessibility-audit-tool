import React from "react";

interface Violation {
  impact?: string;
  message?: string;
  target?: Array<{
    top?: number;
    left?: number;
    width?: number | string;
    height?: number | string;
  }>;
}

interface AuditResult {
  url: string;
  violations: Violation[];
  incomplete: Violation[];
  score?: number;
}

interface OverlayProps {
  allResults: Record<string, AuditResult>;
}

export const Overlay: React.FC<OverlayProps> = ({ allResults }) => {
  console.log("allResults-----", allResults);
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {Object.entries(allResults).map(([url, result]) => (
        <div
          key={url}
          className="absolute top-2 left-2 bg-white p-2 shadow-md rounded"
        >
          <p className="font-bold">{url}</p>
          <p className="text-sm">
            Score: <span className="font-bold">{result.score}/100</span>
          </p>
          {result.violations.map((violation: Violation, index: number) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: violation?.target?.[0]?.top ?? 0,
                left: violation?.target?.[0]?.left ?? 0,
                width: violation?.target?.[0]?.width ?? "auto",
                height: violation?.target?.[0]?.height ?? "auto",
                border: "2px solid red",
                backgroundColor: "rgba(255, 0, 0, 0.1)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
