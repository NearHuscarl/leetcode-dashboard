import { PropsWithChildren, forwardRef } from "react";

export const ChartTitle = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children, ...rest }, ref) => {
    return (
      <div ref={ref} style={{ fontWeight: 500, fontSize: 16 }} {...rest}>
        {children}
      </div>
    );
  }
);
