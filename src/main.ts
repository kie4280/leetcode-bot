import express from "express";
import { verifySig } from "./auth.js";
import discordjs, { Intents } from "discord.js";
import bodyParser from "body-parser";
import { getProblem } from "./dailypush.js";
import dotenv from "dotenv";
import {
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponsePong,
  APIMessageComponent,
  APIPingInteraction,
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT == undefined ? 3000 : process.env.PORT;
// const client = new discordjs.Client({
//   intents: ["DIRECT_MESSAGES", "GUILD_MESSAGES"],
// });
// client.login(process.env.BOT_TOKEN)

// main entry point for the webhook
app.post("/webhook", (req, res) => {
  console.log("endpoint called")
  if (!verifySig(req)) {
    res.status(401).end("invalid request signature");
    return;
  }

  let interaction_obj: APIInteraction = req.body;
  if (interaction_obj.type == InteractionType.Ping) {
    const p = interaction_obj as APIPingInteraction;
    const f: APIInteractionResponsePong = {
      type: InteractionResponseType.Pong,
    };
    res.status(200).json(f);
    return;
  } else if (interaction_obj.type == InteractionType.MessageComponent) {
    const msg: string = interaction_obj.message.content;
    // console.log(client.channels.cache.keys())
    console.log(msg);
  }
});

app.get("/webhook", (req, res) => {
  console.log("sdfkgfdkjghkj")
})

app.get("/", (req, res) => {
  res.status(200).end("hi there");
});

app.get("/control", (req, res) => {
  const t: string = req.body.type;
  switch (t) {
    case "push":
      getProblem(1).then(
        (accept) => {},
        (reject) => {
          res.status(500).end("error getting problem");
        }
      );
      break;

    default:
      break;
  }
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
