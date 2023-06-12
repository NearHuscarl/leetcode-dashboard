import fs from "fs";
import path from "path";
import prettier from "prettier";
import kebabCase from "lodash/kebabCase.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://apiv1.lintcode.com/new/api";
const levelToDifficulty = {
  0: "Easy",
  1: "Easy",
  2: "Medium",
  3: "Hard",
  4: "Hard",
};

const fetchAllLintcodeProblems = async () => {
  const problemCount = 3200;
  const maxPageSize = 200;
  const promises = [];
  for (let i = 0; i < problemCount / maxPageSize; i++) {
    promises.push(
      fetch(
        `${BASE_URL}/problems/?_format=new&page_size=${maxPageSize}&page=${i}`
      ).then((r) => r.json())
    );
  }

  const lintcodeProblems = (await Promise.all(promises))
    .map((r) => r.data)
    .flat();

  // export type TLcQuestion = {
  //   acRate: number;
  //   difficulty: "Easy" | "Medium" | "Hard";
  //   title: string;
  //   titleSlug: string;
  //   likes: number;
  //   dislikes: number;
  //   topicTags: {
  //     name: string;
  //     slug: string;
  //   }[];
  // };
  return lintcodeProblems.map((p) => ({
    acRate: p.accepted_rate,
    difficulty: levelToDifficulty[p.level],
    title: p.en_title,
    titleSlug: kebabCase(p.en_title),
    topicTags: p.problem_tags.map((t) => ({
      slug: t.unique_name,
      name: t.name,
    })),
    lintcodeId: p.problem_id,
  }));
};

const main = async () => {
  const problems = await fetchAllLintcodeProblems();
  const targetPath = path.join(__dirname, "..", "src", "app", "lintcode.g.ts");
  const code = `import { TLeetcode } from "app/api/leetcode";

export const lintcodeProblems: TLeetcode[] = ${JSON.stringify(problems)};`;

  fs.writeFileSync(targetPath, prettier.format(code), { flag: "w" });
};

main();
