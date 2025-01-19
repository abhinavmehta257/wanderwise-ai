import OpenAI from "openai";
import { callAssistant } from "../../../../utils/openAi";
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

export default async function handler(req, res) {

    if(req.method === 'GET') {
        console.log(req.cookies.threadId);
        
        const threadId = req.cookies.threadId;
        try {
            if (threadId) {
            const thread = await openai.beta.threads.messages.list(threadId);
            const mesages = formatJson(thread.data);
            res.status(200).json(mesages);
            } else {
            res.status(404).json({ error: 'Thread not found' });
            }
        } catch (error) {
            console.log('Error fetching thread:', error);
            res.status(404).json({ error: 'Failed to retrieve thread' });
        }
    }

    if (req.method === 'POST') {
        const { user, message } = req.body;
        if (user && message) {
            try {
                let threadId = req.cookies.threadId;
                if (!threadId) {
                    threadId = await openai.beta.threads.create();
                    res.setHeader('Set-Cookie', `threadId=${threadId}; Path=/; HttpOnly`);
                }
                const newMessages = await openai.beta.threads.messages.create(threadId, {
                    role: "user",
                    content: message,
                  });
                  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
                    assistant_id: "asst_MdQvLytr35uEM52fKsRSuhEX",
                  });
              
                  if (run.status === "completed") {
                    const messages = await openai.beta.threads.messages.list(run.thread_id);
                    const response = messages.data;
                    console.log("Assistant response:", response);
                    const formattedMessages = formatJson(response);
                    res.status(200).json(formattedMessages);
                  } else {
                    console.log("Run status:", run.status);
                    return "The assistant couldn't process your request. Please try again.";
                  }
            } catch (error) {
                console.log('Error sending message:', error);
                res.status(500).json({ error: 'Failed to get response from assistant' });
            }
        } else {
            res.status(400).json({ error: 'User and message are required' });
        }
    }
}


function formatJson(data) {
    return data.map(item => {
    const formatted = {
      id: item.id,
      thread_id: item.thread_id,
      role: item.role,
      timestamp: new Date(item.created_at).toLocaleString(),
      content: null
    };
  
      if (item.role === "assistant") {
        try {
          const parsedContent = JSON.parse(item.content[0]?.text?.value || "{}");
          formatted.content = parsedContent.prompt || null;
        } catch (e) {
          formatted.content = "Invalid content format";
        }
      } else {
        formatted.content = item.content[0]?.text?.value || null;
      }
  
      return formatted;
    });
  }