import { useProblems } from "app/services/problems";
import { CardDataGrid } from "./CardDataGrid";

export const DrawerProblems = ({ leetcodeIds }: { leetcodeIds: string[] }) => {
  const cards = useProblems();
  const ids = new Set(leetcodeIds);
  const rows = cards
    .filter((c) => ids.has(c.leetcodeId))
    .map((c) => ({
      id: c.cardId,
      title: c.leetcode?.title ?? c.leetcodeId,
    }));

  return <CardDataGrid rows={rows} />;
};
