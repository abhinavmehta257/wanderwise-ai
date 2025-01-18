// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectDB from "../../../db/db";
import { callAssistant, getDestinationImage } from "../../../utils/openAi";
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {

    // const image = await getDestinationImage("cape town");
    
    

 return res.json({ message: 'Hello World' });
}


