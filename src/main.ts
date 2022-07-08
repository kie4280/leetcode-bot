import express from "express";
import { verifySig } from "./auth.js";
import discordjs, { Intents } from "discord.js";
import {
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponsePong,
  APIPingInteraction,
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT == undefined ? 3000 : process.env.PORT;

app.post("/hook", (req, res) => {
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
  }
});

app.get("/", (req, res) => {
  console.log(req.body);
  res.status(200).end("hi there");
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
