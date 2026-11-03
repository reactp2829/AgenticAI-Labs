import express from "express";
import dotenv from "dotenv"
import z from "zod";
import { StateGraph, interrupt } from "@langchain/langgraph";
import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { ChatGroq } from "@langchain/groq"
import { StateSchema, Command } from "@langchain/langgraph";
import { randomUUID } from "node:crypto"
const app = new express();

dotenv.config()
const port = process.env.PORT || 5000;
app.use(express.json());

// create api here 
// db connection 
const DB_URI = "mongodb+srv://reactpachhi_db_user:KHzIMEfvHAgBZ716@cluster0.qlidmi1.mongodb.net";
const client = new MongoClient(DB_URI);
const checkpointer = new MongoDBSaver({ client })

//create custom state for hadling hinl
const customState = new StateSchema({
    prompt: z.string(),
    approvalRequired: z.boolean(), //yes/no
    aiResponse: z.string(),
    approved: z.boolean(),
    result: z.string()
})

//llm model
const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxRetries: 2,
});
//step1 : create agent node 
const agent = async (state) => {
    const result = await model.invoke([
        {
            role: "system",
            content: `You are a helpful assistant.

        If the user is greeting or asking a normal question,
        respond normally and set approvalRequired to false.

        If the request requires a sensitive external action,
        such as sending an email or deleting a file,
        set approvalRequired to true.
        
        Return JSON with :{
            "response" : "your repsonse",
            "approvalRequired":true or false
        }
        `
        }, {
            role: "user",
            content: state.prompt
        }
    ])
    //convert string to json
    const parsed = JSON.parse(result.content)
    // to handover content to state 
    return {
        aiResponse: parsed.response,
        approvalRequired: parsed.approvalRequired
    }
}
// approval node 
const approvalNode = async (state) => {
    const answer = interrupt({
        message: "Do you approve this action?",
        prompt: state.prompt,
        aiResponse: state.aiResponse
    })
    return {
        approved: String(answer).trim().toLowerCase() === "yes"
    }
}
//action node
const actionNode = async (state) => {
    if (state.approved) {
        return {
            result: `action approved`
        }
    }
    return {
        result: "action reject by human"
    }
}
const shouldContinue = async (state) => {
    if (state.approvalRequired) {
        return "approval"
    }
    return "__end__"
}

// graph creation and connection 
const graph = new StateGraph(customState)
    .addNode("agent", agent)
    .addNode("approval", approvalNode)
    .addNode("action", actionNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("approval", "action")
    .addEdge("action", "__end__")
    .compile({ checkpointer })
// IMPORTANT: Run this before invoking the graph

app.post("/chat", async (req, res) => {
    const { prompt } = req.body
    const threadId = randomUUID()
    // call graph
    const result = await graph.invoke({
        prompt
    },
        {
            configurable: { thread_id: threadId }
        })
    return res.json({
        threadId,
        result: result.result,
        ai: result.aiResponse
    })
})
//resume task 

app.post("/chat/resume", async (req, res) => {
    const { threadId, answer } = req.body
    const result = await graph.invoke(
        new Command({
            resume: String(answer)
        }),
        {
            configurable: { thread_id: threadId }
        }
    )
    return res.json({
        threadId,
        result: result.result
    })
})

app.listen(port, () => {
    console.log(`server is running on langchain file http://localhost:${port}`)
})