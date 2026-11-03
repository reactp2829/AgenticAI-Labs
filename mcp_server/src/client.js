import express from "express"
import dotenv from "dotenv"
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { ChatGroq } from "@langchain/groq"
dotenv.config();
const app = express();
const port = process.env.PORT || 5000

app.use(express.json())
const client = new Client({
    name: "client",
    version: "1.0.0"
})

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxRetries: 2,
});

//connection 
async function start() {
    //connection between client and server 
    const trasport = new StdioClientTransport({
        command: process.execPath,
        args: ["src/server.js"]
    })
    await client.connect(trasport)
    const { tools } = await client.listTools()
    

    const modelwithTools = model.bindTools(
        tools.map(t => ({
            type: "function",
            function: {
                name: t.name,
                description: t.description,
                parameters: t.inputSchema
            }
        }))
    )
    app.post("/chat", async (req, res) => {
        const { prompt } = req.body;

        const response1 = await modelwithTools.invoke([
            {
                role: "human",
                content: prompt
            }
        ])
        if (response1.tool_calls.length) {
            const tool = response1.tool_calls[0]
            const result = await client.callTool({
                name: tool.name,
                arguments: tool.args
            })

            return res.json(result.content[0].text)
        }
        // llm result
        return res.json(response1.content);
    })

    app.listen(port, () => {
        console.log("server is started in", port)
    });
}
start()
//lang chain 
