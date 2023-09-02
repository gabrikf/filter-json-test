import { Tooltip as MUITooltip, TooltipProps } from "@mui/material";
import { PropsWithChildren } from "react";

export interface ITooltipProps extends TooltipProps {
  isDisabled?: boolean;
}

export function Tooltip({
  isDisabled,
  children,
  title,
  ...props
}: PropsWithChildren<ITooltipProps>) {
  if (isDisabled) {
    return children;
  }
  return (
    <MUITooltip title={title} {...props}>
      {children}
    </MUITooltip>
  );
}
