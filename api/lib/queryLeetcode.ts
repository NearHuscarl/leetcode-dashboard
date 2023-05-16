import fetch from "node-fetch";

type TQueryLeetcodeProps = {
  query: string;
  variables: object;
};

export async function queryLeetcode<T>(props: TQueryLeetcodeProps): Promise<T> {
  try {
    const { query, variables = {}, ...rest } = props;
    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables, ...rest }),
    });

    if (r.ok) {
      return r.json() as any;
    } else {
      throw new Error("Failed to query GraphQL. HTTP " + r.status);
    }
  } catch (err) {
    console.log(err);
  }
}
