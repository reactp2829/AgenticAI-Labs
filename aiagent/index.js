import express, { response } from "express"
import dotenv from "dotenv"
dotenv.config();
//import { GoogleGenAI } from "@google/genai";
// import { ChatGoogle } from "@langchain/google/node";
import { ChatGroq } from "@langchain/groq"
const app = express();
const port = process.env.PORT || 5000

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// })

//initialization 
// const langchinModel = new ChatGoogle({
//     model: "gemini-3.6-flash",
//     apiKey: process.env.GEMINI_API_KEY
// })


app.use(express.json())

//content function 
// const main = async () => {
//     const response = await ai.models.generateContent({
//         model: "gemini-3.6-flash",
//         contents: "what is js?"
//     });
//     console.log(response.text)

// }

//create main function 
// const main = async () => {
//     const response = await ai.models.generateContentStream({
//         model: "gemini-3.6-flash",
//         contents: "what is js?"
//     });
//     for await (const chunk of response) {
//         console.log(chunk.text)
//     }
// }
//main()

//project 

// app.post("/chat", async (req, res) => {
//     const { promt } = req.body;
//     //llm call 
//     const response = await ai.models.generateContent({
//         model: "gemini-3.6-flash",
//         contents: promt
//     })
//     return res.json(response.text)
// })

//lang chain 
app.post("/chat", async (req, res) => {
    const { promt } = req.body;
    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        maxRetries: 2,
    });
    const response1 = await model.invoke([
        {
            role: "system",
            content: "you are mallikarjun and my assistenace"
        },
        {
            role: "human",
            content: promt
        }
    ])
    return res.json(response1.content);
})

app.listen(port, () => {
    console.log("server is started in", port)
});