import { ReactNode } from "react";
import startCase from "lodash/startCase";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import grey from "@mui/material/colors/grey";
import { useProblem } from "app/services/problems";
import { Chip, Link, Typography, useTheme } from "@mui/material";
import { LEETCODE_BASE_URL } from "app/settings";
import { AcRateIndicator } from "../AcRateIndicator";
import {
  getCardType,
  getCardTypeFromReview,
  getDueStatus,
  getEaseLabel,
  getNextReviewTime,
} from "app/helpers/card";
import { ReviewTrend } from "../ReviewTrend/ReviewTrend";
import { CardEventDataGrid, TRowItem } from "./CardEventDataGrid";
import { getIntervalTime } from "app/helpers/stats";

type TFieldProps = {
  label: string;
  value: ReactNode;
};

const Field = (props: TFieldProps) => {
  const { label, value } = props;
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={1}
      fontSize={14}
      mb={0.5}
    >
      <div style={{ width: 400, fontWeight: 500, alignSelf: "flex-start" }}>
        {label}
      </div>
      <div style={{ width: "100%" }}>{value}</div>
    </Stack>
  );
};

export const DrawerDetail = ({ leetcodeId }: { leetcodeId: string }) => {
  const theme = useTheme();
  const card = useProblem(leetcodeId);

  if (!card) return null;

  const cardType = getCardType(card);
  const dueStatus = getDueStatus(card);
  const nextReviewDate = formatDistanceToNowStrict(getNextReviewTime(card), {
    addSuffix: true,
  });
  let rows: TRowItem[] = [
    {
      id: card.cardId,
      cardType: "New",
      ease: "unknown",
      interval: 0,
    },
  ];

  return (
    <>
      <Stack direction="row" alignItems="center" mb={2} gap={2}>
        <Typography variant="h5" fontWeight="500">
          <Link href={`${LEETCODE_BASE_URL}/${card.leetcodeId}`}>
            {card.leetcode?.title ?? card.leetcodeId}
          </Link>
        </Typography>
        {card.neetcodeLink && (
          <IconButton
            aria-label="neetcode video"
            onClick={() => window.open(card.neetcodeLink, "_blank")?.focus()}
          >
            <OndemandVideoIcon />
          </IconButton>
        )}
      </Stack>
      <Field
        label="Card Type"
        value={
          <span
            style={{
              fontWeight: 500,
              color: theme.anki.cardType[cardType],
            }}
          >
            {cardType}
          </span>
        }
      />
      <Field
        label="Due Status"
        value={
          <>
            <span
              style={{
                fontWeight: 500,
                color: theme.anki.dueStatus[dueStatus],
              }}
            >
              {startCase(dueStatus)}
            </span>{" "}
            <span style={{ color: grey[500] }}>(Due {nextReviewDate})</span>
          </>
        }
      />
      <Field
        label="Difficulty"
        value={
          <span
            style={{
              color: theme.leetcode.difficulty[card.leetcode?.difficulty!],
            }}
          >
            {card.leetcode?.difficulty}
          </span>
        }
      />
      <Field
        label="Acceptance Rate"
        value={
          <Stack direction="row" alignItems="baseline" gap={1}>
            {card.leetcode?.acRate}%
            <AcRateIndicator value={card.leetcode?.acRate} width={150} />
          </Stack>
        }
      />
      <Field
        label="Tags"
        value={
          <Stack
            direction="row"
            alignItems="baseline"
            flexWrap="wrap"
            gap={0.5}
          >
            {card.leetcode?.topicTags.map((t) => (
              <Chip key={t.name} label={t.name} />
            ))}
          </Stack>
        }
      />
      <Field label="Reviews" value={<ReviewTrend reviews={card.reviews} />} />
      <CardEventDataGrid
        rows={rows
          .concat(
            card.reviews.map((r) => ({
              id: r.id,
              cardType: getCardTypeFromReview(r),
              ease: getEaseLabel(r.ease),
              interval: getIntervalTime(r.ivl),
            }))
          )
          .reverse()}
      />
    </>
  );
};
