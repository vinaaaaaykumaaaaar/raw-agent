import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Define your heavy tool definitions separately
const TOOLS_REGISTRY = {
    weather: {
        name: "get_weather",
        description: "Get the current weather for a specific location.",
        parameters: { type: "object", properties: { location: { type: "string" } } }
    },
    database: {
        name: "query_database",
        description: "Run SQL queries against the user database.",
        parameters: { type: "object", properties: { query: { type: "string" } } }
    }
};

// 2. The Router Function: Uses a cheap model to pick a category
async function routeRequest(userPrompt) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Fast, low-cost routing model
        messages: [
            {
                role: "system",
                content: `You are a routing assistant. Classify the user request into exactly one category: 'weather', 'database', or 'none'. Respond with only the word.`
            },
            { role: "user", content: userPrompt }
        ],
        temperature: 0
    });

    return response.choices[0].message.content.trim().toLowerCase();
}

// 3. The Worker Function: Only loads the selected tool
async function executeWorker(userPrompt, toolCategory) {
    const messages = [{ role: "user", content: userPrompt }];
    const options = { model: "gpt-4o", messages }; // Capable worker model

    // Dynamically inject ONLY the required tool
    if (TOOLS_REGISTRY[toolCategory]) {
        options.tools = [{ type: "function", function: TOOLS_REGISTRY[toolCategory] }];
        options.tool_choice = { type: "function", function: { name: TOOLS_REGISTRY[toolCategory].name } };
    }

    const response = await openai.chat.completions.create(options);
    return response.choices[0].message;
}

// 4. Main Orchestrator
async function runAgent(userPrompt) {
    console.log(`User: ${userPrompt}`);

    // Step 1: Route the request
    const category = await routeRequest(userPrompt);
    console.log(` Router Selected Category: ${category}`);

    // Step 2: Execute with tailored context
    const result = await executeWorker(userPrompt, category);
    console.log(" Worker Tool Call Payload:", result.tool_calls?.[0]?.function);
}

// Example Execution
runAgent("What is the temperature in Tokyo right now?");
