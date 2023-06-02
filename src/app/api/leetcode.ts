import { useQuery } from "@tanstack/react-query";
import { MSS } from "app/settings";

const BASE_URL = "https://leetcode-dashboard.vercel.app";

export type TDifficulty = "Easy" | "Medium" | "Hard";

export type TLeetcode = {
  acRate: number;
  difficulty: TDifficulty;
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
      const fetchProblems = (skip: number) =>
        fetch(`${BASE_URL}/api/leetcode?limit=500&skip=${skip}`).then((r) =>
          r.json()
        );
      // only fetch 500 problems at a time to get around timeout error (free quota 10 seconds per request)
      const all = (await Promise.all([
        fetchProblems(0),
        fetchProblems(500),
        fetchProblems(1000),
        fetchProblems(1500),
        fetchProblems(2000),
        fetchProblems(2500),
        fetchProblems(3000),
      ])) as { problems: Record<string, TLeetcode> }[];

      const problems: Record<string, TLeetcode> = {};
      for (const data of all) {
        for (const id in data.problems) {
          problems[id] = data.problems[id];
        }
      }

      return problems;
    },
    {
      staleTime: MSS.oneMonth,
    }
  );
};
