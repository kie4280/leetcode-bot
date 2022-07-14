import axios from "axios";

// code inspired by https://github.com/chakrakan/leetcode-disc/blob/master/bot.js

type Problem = {
  id: number;
  title: string;
  difficulty: number;
};

const ltBase = "https://leetcode.com/";
const ltApiUrl = "https://leetcode.com/graphql/";
const levels = ["easy", "medium", "hard"];

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

async function getProblem(difficulty: number): Promise<Problem> {
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
        filters: { difficulty: "MEDIUM", tags: ["string"] },
      },
    });
    console.log(r?.data);
    const p: Problem = { id: 0, title: "", difficulty: difficulty };
    return p;
  } catch (e) {
    throw e;
  }
}

export { getProblem };
