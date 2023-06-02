import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import useTheme from "@mui/material/styles/useTheme";
import GppBadIcon from "@mui/icons-material/GppBad";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { TDueStatus } from "app/helpers/card";

type TDueStatusProps = {
  dueStatus: TDueStatus;
  nextReviewTime: number;
};

export const DueStatus = (props: TDueStatusProps) => {
  const { dueStatus, nextReviewTime } = props;
  const theme = useTheme();
  const color = theme.anki.dueStatus[dueStatus];
  const displayedDate = formatDistanceToNowStrict(nextReviewTime, {
    addSuffix: true,
  });

  if (!displayedDate) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {(dueStatus === "stale" || dueStatus === "bad") && (
        <GppBadIcon style={{ color }} />
      )}
      {(dueStatus === "now" || dueStatus === "soon") && (
        <GppMaybeIcon style={{ color }} />
      )}
      {(dueStatus === "good" || dueStatus === "safe") && (
        <GppGoodIcon style={{ color }} />
      )}
      {displayedDate}
    </div>
  );
};
