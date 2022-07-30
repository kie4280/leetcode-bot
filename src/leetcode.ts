import { EmbedBuilder } from "@discordjs/builders";
import axios from "axios";
import fs from "fs";
import { getTag, listChannels } from "./database.js";
import { sendMsg } from "./discord.js";

// code inspired by reverse-engineering leetcode.com
type Problem = {
  title: string;
  url: string;
  difficulty: string;
  hasSolution: boolean;
  isPaid: boolean;
  topic: Array<string>;
  acRate: string;
};

const ltBase = "https://leetcode.com/problems/";
const ltApiUrl = "https://leetcode.com/graphql/";
enum LEVELS {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

const queryTag = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters  
  ) {
      total: totalNum    
      questions: data {
        acRate      
        difficulty      
        freqBar      
        frontendQuestionId: questionFrontendId
        isFavor      
        paidOnly: isPaidOnly      
        status      
        title      
        titleSlug      
        topicTags {
          name        
          slug      
        }
        hasSolution
      }
    }
}

`;

async function getProblems(
  difficulty: string,
  tags: Iterable<string>
): Promise<{ total: number; problems: Array<Problem> }> {
  for (let i = 0; i < 3; ++i) {
    try {
      const r = await axios.post(ltApiUrl, {
        query: queryTag,
        variables: {
          categorySlug: "",
          skip: 0,
          limit: 10000,
          filters: { difficulty: difficulty, tags: tags },
        },
      });
      const ps = r.data.data.problemsetQuestionList;
      const total: number = ps.total;
      const questions: Array<any> = ps.questions;

      const problems: Problem[] = [];
      questions.forEach((v, i, o) => {
        let p: Problem = {
          title: v.title,
          url: ltBase + v.titleSlug,
          difficulty: v.difficulty,
          hasSolution: v.hasSolution,
          isPaid: v.paidOnly,
          topic: v.topicTags.map((v: any, i: number, o: any) => {
            return v.name;
          }),
          acRate: (v.acRate as number).toPrecision(3).toString() + "%",
        };
        problems.push(p);
      });

      return { total, problems };
    } catch (e) {
      console.log(e);
    }
  }
  return { total: 0, problems: [] };
}

function randomLevel(pmf: Array<number> = [0.3, 0.6, 0.1]): number {
  let diffi = Math.random();
  let sum: number = 0;
  for (let a = 0; a < pmf.length; ++a) {
    if (diffi >= sum && diffi <= pmf[a] + sum) {
      diffi = a;
      break;
    }
    sum += pmf[a];
  }

  return diffi;
}

type Tag = {
  id: string;
  name: string;
  slug: string;
  questionCount: number;
};

async function readTags(filep: string = "topicTags.json"): Promise<Array<Tag>> {
  const j = fs.readFileSync(filep);
  const pj: Array<any> = JSON.parse(j.toString()).topicTags;
  let r: Array<Tag> = [];
  pj.forEach((v, i, a) => {
    const m: Tag = {
      id: v.id,
      name: v.name,
      slug: v.slug,
      questionCount: v.questionCount,
    };
    r.push(m);
  });

  return r;
}

function formatProb(p: Problem): EmbedBuilder {
  const b = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(p.title)
    .setURL(p.url)
    .addFields(
      { name: "Difficulty", value: p.difficulty, inline: true },
      { name: "Acceptance Rate", value: p.acRate, inline: true },
      { name: "Has Solution", value: String(p.hasSolution), inline: true },
      { name: "Is Paid", value: String(p.isPaid), inline: true },
      { name: "Topics", value: String(p.topic) }
    );

  return b;
}

async function dailyPush() {
  let title = "每日一題來啦！";
  const tags = await readTags();
  let tag = await getTag();
  const now = new Date(Date.now());
  if (now.getDay() == 6) {
    tag = tag > 70 ? 0 : tag + 1;
  }

  const diffi = randomLevel();
  const probs = await getProblems(Object.keys(LEVELS)[diffi], tags[tag].slug);
  const channels = await listChannels();
  const index = Math.floor(Math.random() * probs.total);
  const prob = probs.problems[index];
  const em = formatProb(prob);
  channels.forEach((v, i, o) => {
    const msg = `@everyone ${title}\n ${prob.url}`;
    sendMsg(v, msg, em);
  });
}

export { dailyPush, getProblems as getProblem, readTags, LEVELS, Problem, Tag };
