import { addChannel, deleteChannel, listChannels } from "../database.js";

addChannel("1")
  .then(() => {
    return addChannel("2");
  })
  .then(() => {
    return deleteChannel("1");
  })
  .then(() => {
    return deleteChannel("2");
  });

listChannels().then((val) => {
  console.log(val[0] == null);
});

process.exit(0);