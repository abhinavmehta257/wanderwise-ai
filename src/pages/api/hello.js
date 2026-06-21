// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectDB from "../../../db/db";
import redis from "../../../utils/redis";

export default async function handler(req, res) {

try {
    const keys = await redis.keys('*');
    const data = {};
    for (const key of keys) {
        data[key] = await redis.get(key);
    }
    res.status(200).json(data);
} catch (error) {
    res.status(500).json({ error: 'Error fetching data from Redis' });
}

 return res.json({ message: 'Hello World' });
}


