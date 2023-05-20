import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import yellow from "@mui/material/colors/yellow";
import lightGreen from "@mui/material/colors/lightGreen";
import grey from "@mui/material/colors/grey";
import { TCardReview } from "app/api/stats";
import { getReviewResult } from "app/helpers/stats";

const reviewResultColors: Record<"wrong" | "hard" | "ok" | "easy", string> = {
  easy: lightGreen[500],
  ok: yellow[500],
  hard: orange[500],
  wrong: red[500],
};

type TReviewStatusProps = {
  reviews?: TCardReview[];
};

export const ReviewStatus = (props: TReviewStatusProps) => {
  const { reviews: reviewsProp } = props;

  if (!reviewsProp) {
    return null;
  }

  const maxReviews = 6;
  const reviews = reviewsProp
    .toReversed()
    .slice(0, maxReviews)
    .map((r) => reviewResultColors[getReviewResult(r)]);

  for (let i = reviews.length; i < maxReviews; i++) {
    reviews.push(grey[300]);
  }

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {reviews.map((color, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};
