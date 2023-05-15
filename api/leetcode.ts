import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProblems } from "./lib/problems.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const limit = Number(request.query.limit) ?? 100;
  const problems = await getProblems(limit);

  response.status(200).json({
    problems,
    success: true,
  });
}
