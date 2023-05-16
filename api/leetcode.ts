import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProblems } from "./lib/problems.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Origin", "*");

  const limit = Number(request.query.limit) ?? 100;
  const skip = Number(request.query.skip) ?? 0;
  const problems = await getProblems(limit, skip);

  response.status(200).json({
    problems,
    success: true,
  });
}
