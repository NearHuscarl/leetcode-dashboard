import { ankiConnect } from "./ankiConnect";

type TNoteInfo = {
  noteId: number;
  modelName: string;
  tags: string[];
  fields: {
    Front: { value: string; order: number };
    Back: { value: string; order: number };
  };
};

export const getNoteInfos = async (notes: number[]) => {
  const noteInfos: TNoteInfo[] = await ankiConnect("notesInfo", { notes });
  return noteInfos;
};
