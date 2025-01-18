// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectDB from "../../../db/db";
import { callAssistant } from "../../../utils/openAi";
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {


    try {
        const keys = await redis.keys('*');
        return res.json({ keys });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

 return res.json({msg:"Hello World"});
}


