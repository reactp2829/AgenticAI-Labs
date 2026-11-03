import express from "express";
import dotenv from "dotenv"
import { ChatGroq } from "@langchain/groq"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import z from "zod";
import fs from "fs"
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const app = new express();

dotenv.config()
const port = process.env.PORT || 5000;
app.use(express.json());

// define llm model 
const model = new ChatGroq({
    model: "openai/gpt-oss-120b"
})

//initalize emedding model 
const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001", // 768 dimensions
    apiKey: process.env.GOOGLE_API_KEY,
    outputDimensionality: 768
});

//initial vector db 
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "groceryDocumentation",
    apiKey: process.env.QDRANT_API_KEY,
    clientConfig: {
        timeout: 30000,
        checkCompatibility: false
    }
});
const upload = async () => {
    const pdfPath = "./grocery.pdf";

    // Read PDF
    const buffer = fs.readFileSync(pdfPath);

    // Extract PDF text
    const pdfResult = new PDFParse({ data: buffer });
    const result = await pdfResult.getText();
    const text = result.text;

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50
    });

    const docs = await splitter.createDocuments([text]);

    console.log("Total documents:", docs.length);

    try {
        // Store documents in Qdrant
        await vectorStore.addDocuments(docs);

        console.log("Successfully stored documents in Qdrant!");
    } catch (error) {
        console.error("Qdrant storage error:", error);
    }
};
//upload()
app.post("/chat",async(req,res)=>{
    const {prompt} = req.body
    //similar data search from vector db 
    const docs = await vectorStore.similaritySearch(prompt,5)
    const context = docs.map(doc=>doc.pageContent).join("/n")
    //invoke model 
    const result = await model.invoke([
        {
            role:"system",
            content : `you are a rag assistant and use this context ${context}`
        },{
            role:"user",
            content:prompt
        }
    ])
    return res.json(result.content)
})
app.listen(port, () => {
    console.log(`server is running on langchain file http://localhost:${port}`)
})