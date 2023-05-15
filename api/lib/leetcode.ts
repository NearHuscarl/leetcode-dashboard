import fetch from "node-fetch";

type TQueryLeetcodeProps = {
  query: string;
  variables: object;
};

export function queryLeetcode<T>(props: TQueryLeetcodeProps): Promise<T> {
  const { query, variables = {}, ...rest } = props;

  return fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables, ...rest }),
  })
    .then((r) => {
      if (r.ok) {
        return r.json() as any;
      } else {
        throw new Error("Failed to query GraphQL. HTTP " + r.status);
      }
    })
    .catch((e) => console.log(e));
}
