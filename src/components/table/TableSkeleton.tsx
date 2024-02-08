import { Skeleton } from "@mui/material";
import { range } from "../../utils/functions/range";

interface ITableSkeletonProps {
  rows?: number;
}

const TABLE_SKELETON_DEFAULT_ROWS = 10 as const;

export function TableSkeleton({
  rows = TABLE_SKELETON_DEFAULT_ROWS,
}: ITableSkeletonProps) {
  const maxLines = rows > TABLE_SKELETON_DEFAULT_ROWS ? 10 : rows;
  return range(maxLines).map((index) => <Skeleton width="100%" key={index} />);
}
