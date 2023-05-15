import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProblems } from "./lib/problems.ts";

export default async function handler(
  _: VercelRequest,
  response: VercelResponse
) {
  const problems = await getProblems();

  response.status(200).json({
    problems,
    success: true,
  });
}
