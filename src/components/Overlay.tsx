import React from "react";

interface OverlayProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issues: any[];
}

export const Overlay: React.FC<OverlayProps> = ({ issues }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      {issues.map((issue, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: issue?.target?.[0]?.top ?? 0,
            left: issue?.target?.[0]?.left ?? 0,
            width: issue?.target?.[0]?.width ?? "auto",
            height: issue?.target?.[0]?.height ?? "auto",
            border: "2px solid red",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
          }}
        />
      ))}
    </div>
  );
};
