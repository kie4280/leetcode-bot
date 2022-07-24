import { Request } from "express";
import nacl from "tweetnacl";
import { PUSH_COMMAND } from "./commands.js";
import { REST } from "@discordjs/rest";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { Routes } from "discord-api-types/v10";
import dotenv from "dotenv";

const PUBLIC_KEY =
  "50859e60b1f8ee81bec4047e4b30a2cfa8cc87e84f703c5c1d6a549893135f8b";
const APPLICATION_ID = "992220279415779368";

function verifySig(req: Request): boolean {
  // Your public key can be found on your application in the Developer Portal

  const signature = req.get("X-Signature-Ed25519");
  const timestamp = req.get("X-Signature-Timestamp");
  const body = JSON.stringify(req.body);

  if (signature == undefined || timestamp == undefined) return false;
  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  return isVerified;
}
dotenv.config();
const rest = new REST({ version: "10" }).setToken(
  process.env.BOT_TOKEN as string
);

async function registerCommands(): Promise<void> {
  const sub_on = new SlashCommandSubcommandBuilder()
    .setName("on")
    .setDescription("Turn on");
  const sub_off = new SlashCommandSubcommandBuilder()
    .setName("off")
    .setDescription("Turn off");
  const c = new SlashCommandBuilder()
    .setName(PUSH_COMMAND)
    .setDescription("Push daily leetcode")
    .addSubcommand(sub_off)
    .addSubcommand(sub_on);

  const r = (await rest.post(Routes.applicationCommands(APPLICATION_ID), {
    body: c,
  })) as Array<any>;
}

async function deleteAllCommands(): Promise<number> {
  const r = (await rest.get(
    Routes.applicationCommands(APPLICATION_ID)
  )) as Array<any>;

  r.forEach(async (element) => {
    await rest.delete(Routes.applicationCommand(APPLICATION_ID, element.id));
  });
  console.log(r);
  return r.length;
}

async function sendMsg(msg: string) {
  // await rest.post(Routes.channelMessage());
}

export { verifySig, registerCommands, sendMsg };
