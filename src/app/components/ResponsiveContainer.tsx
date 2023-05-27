import { PropsWithChildren } from "react";
import { ParentSize } from "@visx/responsive";

export const ResponsiveContainer = ({ children }: PropsWithChildren) => {
  return (
    <ParentSize>
      {(parent) => (
        <div style={{ height: parent.height, width: parent.width }}>
          {children}
        </div>
      )}
    </ParentSize>
  );
};
