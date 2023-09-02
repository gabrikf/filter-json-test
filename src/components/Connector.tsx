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
  height = "30px",
  boxSize = "86px",
  text,
}: IConnectorProps) {
  return (
    <Stack alignItems="center" width={boxSize} height={height}>
      <VerticalLine />
      <Typography>{text}</Typography>
      <VerticalLine />
    </Stack>
  );
}
