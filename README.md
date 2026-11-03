# AgenticAI-Labs 🚀

### Learn. Build. Experiment. Create Intelligent AI Applications.

Welcome to **AgenticAI-Labs**!

This repository is a collection of practical implementations and learning examples focused on **Agentic AI, Large Language Models (LLMs), and AI application development using Node.js and JavaScript**.

The goal of this repository is to understand how modern AI technologies work and how to use them to build real-world applications.

Whether you are learning AI development or exploring how AI agents work, this repository will help you understand the concepts through practical examples.

---

## 📚 What You Will Find Here

This repository covers five important areas of modern AI development.

### 1. AI Agents (`aiagent/`)

AI agents are applications that use an LLM to understand a task, make decisions, and perform actions using available tools.

**Concepts:**
- Introduction to AI agents
- LLM-powered agents
- Tool calling
- Function calling
- Agent execution
- Connecting AI models with external tools

**What you will learn:**

How to build AI applications that can understand user requests and perform tasks using tools instead of only generating text.

### 2. LangChain (`langchain/`)

LangChain helps developers build applications using Large Language Models.

It provides building blocks to connect AI models, prompts, tools, databases, and external services.

**Concepts:**
- LangChain fundamentals
- Chat models
- Prompt templates
- Messages and output parsers
- Chains and LCEL
- Embeddings
- Document loaders
- Text splitting
- Tool calling
- Conversation memory

**What you will learn:**

How to integrate LLMs into Node.js applications and build AI-powered features.

### 3. LangGraph (`langgraph/`)

LangGraph helps developers build AI workflows that contain multiple steps, decisions, and interactions.

It is useful when an AI application needs to remember information, decide what to do next, or execute multiple tasks.

**Concepts:**
- Graph architecture
- Nodes and edges
- State management
- Conditional routing
- Tool execution
- Agent workflows
- Human-in-the-loop
- Checkpointing
- Multi-agent workflows

**What you will learn:**

How to build structured AI agents that can manage state, make decisions, and execute complex workflows.

### 4. RAG – Retrieval-Augmented Generation (`rag/`)

RAG allows an AI application to retrieve information from external documents or databases before generating an answer.

Instead of depending only on the knowledge learned during model training, the application can use relevant information from your own data.

**Concepts:**
- RAG architecture
- Document ingestion
- Document chunking
- Text embeddings
- Vector databases
- Vector storage
- Similarity search
- Semantic search
- Context retrieval
- Question answering using custom data

**What you will learn:**

How to build AI applications that can search your own data and generate answers based on the retrieved information.

### 5. MCP Server (`mcp_server/`)

MCP stands for Model Context Protocol.

It provides a standard way for AI applications to connect with external tools, services, and data sources.

**Concepts:**
- MCP fundamentals
- MCP architecture
- MCP clients and servers
- MCP tools
- MCP resources
- MCP prompts
- Tool execution
- Connecting AI applications with external systems

**What you will learn:**

How to create MCP servers and expose tools that AI applications can use to interact with external services.

---

## 🏗️ How Everything Works Together

The following diagram shows how these technologies can work together in an Agentic AI application.

```text
                  USER
                    |
                    v
              AI APPLICATION
                    |
                    v
                   LLM
                    |
                    v
                LANGCHAIN
                    |
                    v
                LANGGRAPH
                    |
          +---------+---------+
          |         |         |
          v         v         v
         RAG       TOOLS      MCP
          |         |         |
          v         v         v
      VECTOR DB  FUNCTIONS  MCP SERVER
          |         |         |
          +---------+---------+
                    |
                    v
             FINAL RESPONSE
```

**Simple explanation:**

1. The user sends a request to the application.
2. The LLM understands the request.
3. LangChain connects the model with prompts, tools, and other components.
4. LangGraph manages the workflow and decides the next action.
5. RAG retrieves relevant information when required.
6. MCP provides a standard way to access external tools and resources.
7. The application returns the final response to the user.

*This is an example architecture. Not every application needs all these technologies.*

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript | Programming language |
| Node.js | JavaScript runtime |
| LangChain | LLM application development |
| LangGraph | Stateful AI workflows |
| LLMs | Text generation and reasoning |
| Embeddings | Convert text into vectors |
| Vector Database | Store and search vector data |
| RAG | Retrieve external knowledge |
| MCP | Connect AI applications with external tools |

---

## 📂 Repository Structure

```text
AgenticAI-Labs/
│
├── aiagent/
│   └── AI Agent examples
│
├── langchain/
│   └── LangChain examples
│
├── langgraph/
│   └── LangGraph examples
│
├── mcp_server/
│   └── MCP Server examples
│
├── rag/
│   └── RAG implementations
│
├── .gitignore
│
└── README.md
```

Each folder contains implementations related to its respective topic. More examples and projects will be added as the repository grows.

---

## ⚙️ Getting Started

### Prerequisites

Before exploring the examples, you should have:

- Basic JavaScript knowledge
- Basic Node.js knowledge
- Understanding of REST APIs
- Basic knowledge of asynchronous programming
- Node.js and npm installed

### Clone the Repository

```bash
git clone https://github.com/reactp2829/AgenticAI-Labs.git
```

Navigate into the repository:

```bash
cd AgenticAI-Labs
```

Explore the folders and open the examples you want to learn.

**Note:** Check the individual folder's `package.json` and configuration before installing dependencies or running an example. Some examples may require API keys or external services.

---

## 🎯 Goals of This Repository

My main goals are:

- Understand LLM concepts and practical implementations.
- Develop AI applications using Node.js and JavaScript.
- Build AI agents using LangChain and LangGraph.
- Implement RAG with vector databases.
- Create MCP servers and integrate external tools.
- Understand human-in-the-loop workflows.
- Experiment with multi-agent systems.
- Build practical, real-world Agentic AI projects.

---

## 👨‍💻 About This Project

AgenticAI-Labs is my hands-on learning and development journey in the field of Generative AI and Agentic AI.

I believe that understanding a technology is not enough. The best way to learn is to implement it, experiment with it, understand the problems, and build something useful.

This repository will continue to grow with new concepts, practical implementations, and real-world AI projects.

**Let's learn, build, and explore the future of AI together!**

---

⭐ If you find this repository useful, consider giving it a star and sharing your feedback.

**GitHub Repository:** https://github.com/reactp2829/AgenticAI-Labs