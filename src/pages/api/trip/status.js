import redis from "../../../../utils/redis";
import { getTripJob } from "../../../../utils/tripJobStatus";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const jobId = req.query.jobId?.trim();

  if (!jobId) {
    return res.status(400).json({ error: "jobId is required" });
  }

  const status = await getTripJob(jobId);

  if (!status) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.status(200).json(status);
}
