import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import startCase from "lodash/startCase";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import { useSelector } from "app/store/setup";
import { globalActions } from "app/store/globalSlice";
import { useProblem } from "app/services/problems";
import { Chip, Link, Typography, useTheme } from "@mui/material";
import { LEETCODE_BASE_URL } from "app/settings";
import { AcRateIndicator } from "../AcRateIndicator";
import { getCardType, getDueStatus, getNextReviewTime } from "app/helpers/card";
import { ReviewStatus } from "../ReviewStatus";

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

export const DetailDrawer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isOpen = useSelector((state) => state.global.drawer.open);
  const detailId = useSelector((state) => state.global.drawer.problemDetailId);
  const card = useProblem(detailId);
  const anchor = "left";

  if (!card) return null;

  const cardType = getCardType(card);
  const dueStatus = getDueStatus(card);
  const nextReviewDate = formatDistanceToNowStrict(getNextReviewTime(card), {
    addSuffix: true,
  });

  return (
    <Drawer
      anchor={anchor}
      open={isOpen}
      onClose={() => dispatch(globalActions.setDrawerOpen(false))}
    >
      <Box sx={{ width: 500, p: 2 }} role="presentation">
        <Stack direction="row" alignItems="center" mb={2} gap={2}>
          <Typography variant="h5">
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
        <Field
          label="Reviews"
          value={<ReviewStatus reviews={card.reviews} />}
        />
      </Box>
    </Drawer>
  );
};
