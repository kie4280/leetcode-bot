import { addChannel, deleteChannel, listChannels } from "../database.js";

addChannel("sjkldjsklfj").then(() => {
  deleteChannel("2");
});

listChannels().then((val) => {
  console.log(val);
});
