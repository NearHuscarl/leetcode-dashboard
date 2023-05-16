import { queryLeetcode } from "./queryLeetcode.js";

type TQueryProblemsProps = {
  limit: number;
  skip?: number;
};

export type TLcQuestion = {
  acRate: number;
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  titleSlug: string;
  likes: number;
  dislikes: number;
  topicTags: {
    name: string;
    slug: string;
  }[];
};

export const queryProblems = async ({
  limit,
  skip = 0,
}: TQueryProblemsProps) => {
  const result = await queryLeetcode({
    query: `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      acRate
      difficulty
      title
      titleSlug
      likes
      dislikes
      topicTags {
        name
        slug
      }
    }
  }
}
`,
    variables: {
      categorySlug: "",
      skip,
      limit,
      filters: {},
    },
  });

  return (result ?? ({} as any))?.data?.problemsetQuestionList as {
    questions: TLcQuestion[];
    total: number;
  };
};
