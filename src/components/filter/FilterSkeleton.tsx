import { Skeleton, Stack } from "@mui/material";

interface IFilterSkeletonProps {
  height?: string;
}

export function FilterSkeleton({ height = "60px" }: IFilterSkeletonProps) {
  return (
    <Stack spacing="20px" width="100%" direction="row">
      <Skeleton variant="rounded" width="100%" height={height} />
      <Skeleton variant="rounded" width="100%" height={height} />
      <Skeleton variant="rounded" width="100%" height={height} />
      <Skeleton width="250px" variant="circular" height={height} />
      <Skeleton width="250px" variant="circular" height={height} />
      <Skeleton width="250px" variant="circular" height={height} />
    </Stack>
  );
}
