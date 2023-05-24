import { PropsWithChildren } from "react";

export const ChartTitle = ({ children }: PropsWithChildren) => {
  return <div style={{ fontWeight: 500, fontSize: 16 }}>{children}</div>;
};
