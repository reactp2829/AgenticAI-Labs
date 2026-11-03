import express from "express";
import dotenv from "dotenv"
import { ChatGoogle } from "@langchain/google";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, context, createAgent, HumanMessage, tool, ToolMessage } from "langchain"
import z from "zod";
import { MessagesAnnotation, StateGraph, MemorySaver } from "@langchain/langgraph";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
const app = new express();

dotenv.config()
const port = process.env.PORT || 5000;
app.use(express.json());

// create api here 
// db connection 
const DB_URI = "postgresql://postgres:Demo%40100@localhost:5432/ai_memory?sslmode=disable";
const checkpointer = PostgresSaver.fromConnString(DB_URI);

// IMPORTANT: Run this before invoking the graph
try {
    console.log("Initializing PostgreSQL checkpointer...");
    await checkpointer.setup();
    console.log("Checkpoint tables created successfully!");
} catch (error) {
    console.error("Checkpointer setup failed:", error);
    process.exit(1);
}
// await checkpointer.setup();
// ai agent = llm + tools

//custom tool
const tool1 = tool(
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
const tool2 = tool(
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
// tools
const tools = [tool1, tool2]
//llm model
const model = new ChatGoogle("gemini-3.6-flash").bindTools(tools)

//Create tool node for langgraph
const toolNode = new ToolNode(tools);
//create agent / llm node built in model used 
const agentNode = async (state) => {
    const result = await model.invoke(
        state.messages
    )
    return {
        messages: [result]
    }
}
//state conatins for understand
// state = [
//     HumanMessage=>"",
//     AIMessages=>"",
//     ToolMessage=>"",
//     AIMessages=>""
// ]

//condtional edge 
const shouldContinue = async (state) => {
    if (state.messages[state.messages.length - 1].tool_calls.length > 0) {
        return "tool_node"
    } else {
        return "__end__"
    }
}

//short term meory 

//const checkpointer = new MemorySaver();

//create graph 
const graph = new StateGraph(MessagesAnnotation)
    .addNode("agent", agentNode)
    .addNode("tool_node", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tool_node", "agent")
    .compile({ checkpointer })
//create agent
app.post("/chat", async (req, res) => {
    const { promt } = req.body;
    //invoke graph
    const resultValue = await graph.invoke({
        messages: [
            {
                role: "user",
                content: promt
            }
        ]
    }, {
        configurable: { thread_id: "user_101" }
    })
    return res.json(resultValue.messages[resultValue.messages.length - 1].content)
})

app.listen(port, () => {
    console.log(`server is running on langchain file http://localhost:${port}`)
})