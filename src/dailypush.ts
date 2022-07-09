import axios from "axios";

// code inspired by https://github.com/chakrakan/leetcode-disc/blob/master/bot.js

type Problem = {
  id: number;
  title: string;
  difficulty: number;
};

const problemUrlBase = "https://leetcode.com/problems/";
const ltApiUrl = "https://leetcode.com/api/problems/all/";
const levels = ["easy", "medium", "hard"];

async function getProblem(difficulty: number): Promise<Problem> {
  const r = await axios.get(ltApiUrl);
  const p: Problem = { id: 0, title: "", difficulty: difficulty };
  return p;
}

export { getProblem };
