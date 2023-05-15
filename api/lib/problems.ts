import { queryProblems, TLcQuestion } from "./queryProblems.ts";

export const getProblems = async () => {
  console.log("fetching LC problems...");
  const { questions, total } = await queryProblems({ limit: 3 });
  console.log(`LC problems: ${total}`);

  const problemLookup: Record<string, TLcQuestion> = {};

  for (const problem of questions) {
    problem.acRate = Math.round(problem.acRate * 10) / 10;
    problemLookup[problem.titleSlug] = problem;
  }

  return problemLookup;
};
