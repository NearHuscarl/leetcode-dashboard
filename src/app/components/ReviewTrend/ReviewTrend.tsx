import { TCardReview } from "app/api/stats";
import { getEaseLabel } from "app/helpers/card";
import { ReviewDot } from "./ReviewDot";

type TReviewTrendProps = {
  reviews?: TCardReview[];
};

export const ReviewTrend = (props: TReviewTrendProps) => {
  const { reviews: reviewsProp } = props;

  if (!reviewsProp) {
    return null;
  }

  const maxReviews = 6;
  const reviews = reviewsProp
    .toReversed()
    .slice(0, maxReviews)
    .map((r) => getEaseLabel(r.ease));

  for (let i = reviews.length; i < maxReviews; i++) {
    reviews.push("unknown");
  }

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {reviews.map((result, i) => (
        <ReviewDot key={i} result={result} />
      ))}
    </div>
  );
};
