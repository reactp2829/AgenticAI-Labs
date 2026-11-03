import express from "express";
import dotenv from "dotenv"
import { ChatGoogle } from "@langchain/google";
import { TavilySearch } from "@langchain/tavily";
import { createAgent, tool } from "langchain"
import z from "zod";
const app = new express();

dotenv.config()
const port = process.env.PORT || 5000;
app.use(express.json());

// create api here 

// ai agent = llm + tools
//tool 
const tool1 = new TavilySearch({
    maxResults: 5,
    topic: "general",
});
//custom tool
const tool2 = tool(
    ({ a, b }) => {
        return `addition of two number is ${a} and ${b} is 7`
    },
    {
        name: "addition_tool",
        description: "use this tool for addition of two nyumbers",
        schema: z.object({
            a: z.number(),
            b: z.number()
        })
    })

// custom tool3 email send 
const tool3 = tool(
    ({ email, content }) => {
        return `email send successfully to ${email} and content is ${content}`
    },
    {
        name: "email_send_tool",
        description: "use this tool send mail",
        schema: z.object({
            email: z.string().describe("sender mail"),
            content: z.string().describe("email body")
        })
    }
)
// model 
const model = new ChatGoogle("gemini-3.6-flash")
//create agent
app.post("/chat", async (req, res) => {
    const { promt } = req.body;
    const agent = createAgent({
        model,
        tools: [tool1, tool2, tool3]
    })

    const result = await agent.invoke({
        messages: {
            role: "user",
            content: promt
        }
    })
    return res.json(result.messages[result.messages.length - 1].content)
})

app.listen(port, () => {
    console.log(`server is running on host http://localhost:${port}`)
})