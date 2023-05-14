import { ankiConnect } from "./ankiConnect";

type TCardInfo = {
  answer: string;
  question: string;
  deckName: string;
  modelName: string;
  fieldOrder: number;
  fields: {
    Front: { value: string; order: number };
    Back: { value: string; order: number };
  };
  css: string;
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

export const getCardInfos = async (cards: number[]) => {
  const cardInfos: TCardInfo[] = await ankiConnect("cardsInfo", { cards });

  return cardInfos.map((cardInfo) => {
    const { fields, question, answer, css, ...rest } = cardInfo;
    return {
      ...rest,
      leetcodeId:
        cardInfo.fields.Front.value.match(
          /https:\/\/leetcode.com\/problems\/([\w-]+)/
        )?.[1] ?? "",
      neetcodeLink: cardInfo.fields.Back.value.match(/href="(.*)"/)?.[1] ?? "",
    };
  });
};
