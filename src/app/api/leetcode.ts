import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://leetcode-dashboard.vercel.app";

export type TLeetcode = {
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

export const useLeetcodeProblems = () => {
  return useQuery<unknown, unknown, Record<string, TLeetcode>>(
    ["leetcodeProblems"],
    async () => {
      // TODO: fetch all LC problems (limit=3000) leads to timeout error (free quota 10 seconds per request)
      const response = await fetch(`${BASE_URL}/api/leetcode?limit=1000`);
      const data = await response.json();
      return data.problems;
    },
    {
      staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  );
};
