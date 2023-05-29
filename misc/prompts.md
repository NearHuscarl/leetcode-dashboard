#nosearch I'm writing a leetcode dashboard web app in reactjs-typescript to keep track of my leetcode progress, I use anki to automate the review process to help me remember old problems better, the data is fetched from anki database using anki-connect addon. Do you find anything that could be used to display on sunburst chart, here is my model definition:

```typescript
export type TCardReview = {
  id: number;
  usn: number;
  ease: 1 | 2 | 3 | 4;
  ivl: number;
  lastIvl: number;
  factor: number;
  time: number;
  type: 0 | 1 | 2 | 3;
};

export type TCard = {
  reviews: TCardReview[];
  tags: string[];

  leetcodeId: string;
  neetcodeLink: string;
  deckName: string;
  modelName: string;
  fieldOrder: number;
  cardId: number;
  interval: number;
  note: number;
  ord: number;
  type: number;
  queue: number;
  due: number;
  reps: number;
  lapses: number;
  left: number;
  mod: number;
};

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

export type TCardModel = TCard & {
  leetcode?: TLeetcode;
};
```
