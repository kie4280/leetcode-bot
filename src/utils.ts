import { Request } from "express";
import nacl from "tweetnacl";
import { REGISTER_COMMAND, PUSH_COMMAND } from "./commands.js";
import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Routes } from "discord-api-types/v10";
import dotenv from 'dotenv'

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

async function checkCommands(): Promise<boolean> {
  const c = new SlashCommandBuilder()
    .setName(PUSH_COMMAND)
    .setDescription("Push daily leetcode");

  await rest.post(Routes.applicationCommands(APPLICATION_ID), {
    body: c,
  });
  return true;
}

async function sendMsg() {}

export { verifySig, checkCommands };
