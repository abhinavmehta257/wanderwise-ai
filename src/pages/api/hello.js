// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { callAssistant } from "../../../utils/openAi";

export default async function handler(req, res) {
 const msg= await callAssistant("hi","1212121");
 return res.json(msg)
}
