import { Box, Stack, Typography } from "@mui/material";

interface IConnectorProps {
  height?: string;
  boxSize?: string;
  text?: string;
}

function VerticalLine() {
  return <Box borderLeft="solid 1px #ccc" height="100%" width="1px" />;
}

export function Connector({
  height = "90px",
  boxSize = "86px",
  text,
}: IConnectorProps) {
  const verticalHeight = text ? height : `calc(${height} / 2)`;
  return (
    <Stack alignItems="center" width={boxSize} height={verticalHeight}>
      <VerticalLine />
      <Typography>{text}</Typography>
      <VerticalLine />
    </Stack>
  );
}
