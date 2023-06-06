import { useProblems } from "app/services/problems";
import { CardDataGrid } from "./CardDataGrid";
import { useSelector } from "app/store/setup";

export const DrawerProblems = ({ leetcodeIds }: { leetcodeIds: string[] }) => {
  const cards = useProblems();
  const column = useSelector((state) => state.global.drawer.column);
  const ids = new Set(leetcodeIds);
  const rows = cards.filter((c) => ids.has(c.leetcodeId));

  return <CardDataGrid rows={rows} column={column} />;
};
