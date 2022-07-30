import {
  getProblem,
  dailyPush,
  readTags,
  LEVELS,
  Problem,
  Tag,
} from "../leetcode.js";

// const tags = readTags();
// tags.then((val) => {
//   console.log(val.length);
// });

// const r = getProblem(LEVELS.EASY, "array");
// r.then((r) => {
//   console.log(r);
// }).catch((e) => {
//   console.log("err");
//   console.log(e.response.data);
// });

dailyPush().catch((err) => console.log(err));
