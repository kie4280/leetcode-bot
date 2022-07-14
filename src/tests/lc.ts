import { getProblem } from "../dailypush.js";

const r = getProblem(1);
r.then((r) => {}).catch((e) => {
  console.log('err');
  console.log(e.response.data)
});
