import { Skeleton, Stack } from "@mui/material";
import { range } from "../../../utils/functions/range";

interface ITableSkeletonProps {
  rows?: number;
}

interface ILineSkeletonProps {
  height?: string;
}

const TABLE_SKELETON_DEFAULT_ROWS = 10 as const;

export function TableSkeleton({
  rows = TABLE_SKELETON_DEFAULT_ROWS,
}: ITableSkeletonProps) {
  const maxLines = rows > TABLE_SKELETON_DEFAULT_ROWS ? 10 : rows;
  return range(maxLines).map((index) => <Skeleton width="100%" key={index} />);
}

export function LineSkeleton({ height = "60px" }: ILineSkeletonProps) {
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
