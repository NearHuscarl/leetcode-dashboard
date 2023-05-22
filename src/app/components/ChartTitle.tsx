import { PropsWithChildren } from "react";

export const ChartTitle = ({ children }: PropsWithChildren) => {
  return <div style={{ fontWeight: 500, fontSize: 19 }}>{children}</div>;
};
