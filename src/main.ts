import express from "express";
import { verifySig, registerCommands } from "./utils.js";
import bodyParser from "body-parser";
import { getProblem } from "./leetcode.js";
import dotenv from "dotenv";
import { addChannel, deleteChannel } from "./database.js";
import {
  APIApplicationCommandInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponsePong,
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
  console.log("endpoint called");
  console.log(req.body);
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
  } else if (interaction_obj.type == InteractionType.ApplicationCommand) {
    const f: APIInteractionResponseChannelMessageWithSource = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: "Roger that!" },
    };
    res.status(200).json(f);
    applicationComm(interaction_obj);
  }
});

app.get("/", (req, res) => {
  res.status(200).end("hi there");
});

// app.get("/control", (req, res) => {
//   const t: string = req.body.type;
//   switch (t) {
//     case "push":
//       getProblem(1).then(
//         (accept) => {},
//         (reject) => {
//           res.status(500).end("error getting problem");
//         }
//       );
//       break;

//     default:
//       break;
//   }
// });

app.listen(port, () => {
  registerCommands();
  console.log(`listening on ${port}`);
});

function applicationComm(interaction: APIApplicationCommandInteraction) {
  switch (interaction.data.name) {
    case "pushproblem":
      const sub: string = (interaction.data as any).options[0].name;
      const chanID = interaction.channel_id;
      // console.log("option", option)
      if (sub == "off") {
        deleteChannel(chanID);
      } else if (sub == "on") {
        addChannel(chanID);
      }
      break;

    default:
      break;
  }
}
