import admin from "firebase-admin";
import fs from "fs";

const CRED_PATH = "firebase-cred.json";

admin.initializeApp({
  credential: admin.credential.cert(CRED_PATH),
  databaseURL: "https://leetcodetw-uiuc-default-rtdb.firebaseio.com",
});

const db = admin.database();

async function addChannel(channelID: string) {
  let ref = db.ref("/");
  const d = await ref.get();
  let old: Array<string>;
  if (!d.child("channels").exists()) {
    old = [];
  } else {
    old = d.child("channels").val();
  }
  console.log(old);
  await ref.update({ channels: old.concat([channelID]) });
}

async function deleteChannel(channelID: string) {
  const d = await db.ref("/").get();
  if (!d.child("channels").exists()) {
    return;
  }
  let c: Array<string> = d.child("channels").val();
  c = c.filter((v, i, a) => {
    if (channelID == v) return false;
    return true;
  });
  await db.ref("/").update({ channels: c });
}

async function listChannels() {
  let chans = await db.ref("/channels").get();
  return chans.val() as Array<string>;
}

async function saveTag(index: number) {
  let ref = db.ref("/lastTagIndex");
  await ref.update(index);
}

async function getTag(): Promise<number> {
  let ref = db.ref("/");
  const d = await ref.child("lastTagIndex").get();
  let last = 0;
  if (d.exists()) {
    last = d.val();
  }
  return last as number;
}

export { addChannel, deleteChannel, listChannels, saveTag, getTag };
