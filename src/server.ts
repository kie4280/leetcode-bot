import express from "express";
import { verifySig, registerCommands } from "./discord.js";
import bodyParser from "body-parser";
import { dailyPush, getProblems } from "./leetcode.js";
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
    const f = applicationComm(interaction_obj);
    res.status(200).json(f);
  }
});

// For testing purposes
app.get("/", (req, res) => {
  res.status(200).end("hi there");
});

app.post("/dailypush", (req, res) => {
  dailyPush().then(
    (val) => {
      res.sendStatus(200);
    },
    (err) => {
      res.status(500).send(err);
    }
  );
});


app.listen(port, () => {
  registerCommands();
  console.log(`listening on ${port}`);
});

function applicationComm(interaction: APIApplicationCommandInteraction) {
  let f: APIInteractionResponseChannelMessageWithSource = {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {},
  };
  switch (interaction.data.name) {
    case "pushproblem":
      const sub: string = (interaction.data as any).options[0].name;
      const chanID = interaction.channel_id;
      // console.log("option", option)

      if (sub == "off") {
        deleteChannel(chanID);
        f.data.content = "Roger that! It's off.";
      } else if (sub == "on") {
        addChannel(chanID);
        f.data.content = "It's on baby!";
      }
      break;

    default:
      break;
  }

  return f;
}
