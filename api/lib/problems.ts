import { queryProblems, TLcQuestion } from "./queryProblems.js";

export const getProblems = async (limit: number) => {
  console.log("fetching LC problems...");
  const { questions, total } = await queryProblems({ limit });
  console.log(`LC problems: ${total}`);

  const problemLookup: Record<string, TLcQuestion> = {};

  for (const problem of questions) {
    problem.acRate = Math.round(problem.acRate * 10) / 10;
    problemLookup[problem.titleSlug] = problem;
  }

  return problemLookup;
};
