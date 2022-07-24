import axios from "axios";
import fs from "fs";

// code inspired by https://github.com/chakrakan/leetcode-disc/blob/master/bot.js

type Problem = {
  id: number;
  title: string;
  difficulty: number;
};

const ltBase = "https://leetcode.com/";
const ltApiUrl = "https://leetcode.com/graphql/";
enum LEVELS {
  "EASY",
  "MEDIUM",
  "HARD",
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
          id        
          slug      
        }
        hasSolution
      }
    }
}

`;

async function getProblem(
  difficulty: LEVELS,
  tags: Iterable<string>
): Promise<Problem> {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const r = await axios.post(ltApiUrl, {
      query: queryTag,
      variables: {
        categorySlug: "",
        skip: 0,
        limit: 50,
        filters: { difficulty: difficulty, tags: tags },
      },
    });
    console.log(r?.data);
    const ps = r.data.problemsetQuestionList;
    const total = ps.total;
    const questions = ps.questions;

    const p: Problem = { id: 0, title: "", difficulty: difficulty };
    return p;
  } catch (e) {
    throw e;
  }
}

type Tag = {
  id: string;
  name: string;
  slug: string;
  questionCount: number;
};

function getTags(filep: string = "topicTags.json"): Array<Tag> {
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

export { getProblem, getTags, LEVELS, Problem, Tag };
