import React from "react";

interface TearEffectProps {
  topColor: string;
  bottomColor: string;
  direction?: "right-to-left" | "left-to-right";
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  height?: string; // e.g. '300px' or '50vh'
}

export function TearEffect({
  topColor,
  bottomColor,
  direction = "right-to-left",
  topContent,
  bottomContent,
}: //   height = "300px",
TearEffectProps) {
  // Define clip-path polygons for tear directions
  const clipPaths = {
    "right-to-left": "polygon(0 0, 100% 10%, 100% 100%, 0% 100%)",
    "left-to-right": "polygon(0 10%, 100% 0, 100% 100%, 0 100%)",
  };

  return (
    <div style={{ backgroundColor: topColor }}>
      {/* Top section */}
      <div style={{ backgroundColor: topColor }} className="relative z-10">
        {topContent}
      </div>

      <div className="relative z-0 overflow-visible">
        {/* Tear overlay as decorative layer */}
        <div
          style={{
            backgroundColor: bottomColor,
            clipPath: clipPaths[direction],
            WebkitClipPath: clipPaths[direction],
            height: "100px", // height of the tear
            marginBottom: "-80px",
          }}
        />
        <div style={{ backgroundColor: bottomColor }} className="relative z-10">
          {bottomContent}
        </div>
      </div>
    </div>
  );
}
