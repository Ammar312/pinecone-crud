import express from "express";
import { customAlphabet } from "nanoid";
import { client } from "../mongodb.mjs";
import { ObjectId } from "mongodb";
import pineconeClient, { openai as openaiClient } from "../pinecone.mjs";

const router = express.Router();
const dateVar = JSON.stringify(new Date());
const result = dateVar.slice(0, 11);
const db = client.db("crudDB");
const dbCollection = db.collection("posts");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

const pineIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME);
console.log(pineIndex);

router.get("/post/:postId", (req, res, next) => {
  res.send("This is post " + new Date());
});

router.get("/posts", async (req, res, next) => {
  try {
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: "",
    });
    const vector = response?.data[0]?.embedding;

    const queryResponse = await pineIndex.query({
      vector: vector,
      topK: 10000,
      includeValues: false,
      includeMetadata: true,
    });
    console.log("queryResponse", queryResponse);
    const formattedOutput = queryResponse.matches.map((eachMatch) => ({
      text: eachMatch?.metadata?.text,
      title: eachMatch?.metadata?.title,
      _id: eachMatch?.id,
    }));

    res.send(formattedOutput);
  } catch (error) {
    console.log("error getting data pinecone: ", error);
    res.status(500).send("server error, please try later");
  }
});

router.post("/post", async (req, res, next) => {
  if (!req.body.title || !req.body.text) {
    res.status(403).send(`Required parameter missing`);
    return;
  }
  try {
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: `${req.body.title} ${req.body.text}`,
    });
    console.log(response);

    const vector = response?.data[0]?.embedding;
    console.log("vector: ", vector);

    const upsertResponse = await pineIndex.upsert([
      {
        id: nanoid(), // unique id
        values: vector,
        metadata: {
          title: req.body.title,
          text: req.body.text,
          createdOn: new Date().getTime(),
        },
      },
    ]);
    console.log("upsertResponse: ", upsertResponse);

    res.send(`Post Created at ${result}`);
  } catch (error) {}
});

router.put("/post/:postId", async (req, res, next) => {
  const id = req.params.postId;
  if (!req.body.title || !req.body.text) {
    res.status(403).send(`Required parameter missing`);
    return;
  }
  try {
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: `${req.body.title} ${req.body.text}`,
    });
    const vector = response?.data[0]?.embedding;

    const upsertResponse = await pineIndex.upsert([
      {
        id: req.params.postId,
        values: vector,
        metadata: {
          title: req.body.title,
          text: req.body.text,
        },
      },
    ]);

    res.send("Post Updated Successfully");
  } catch (error) {
    res.status(500).send("server error, please try later");
  }
  console.log(id);
});

router.delete("/post/:postId", async (req, res, next) => {
  const id = req.params.postId;
  try {
    await pineIndex.deleteOne(id);
    res.send("Post Deleted Successfully");
  } catch (error) {
    res.status(404).send("Not Found");
  }
});

export default router;
