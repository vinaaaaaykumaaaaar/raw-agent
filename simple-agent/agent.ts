import { callModel } from "./model";
import type { Message, Tool } from "./types";

export async function runAgent(userInput: string, tools: Tool[]) {

    const messages: Message[] = [
        {
            role: "user",
            content: userInput
        }
    ];

    while (true) {
        console.log("\n--- CALLING MODEL ---");

        console.log("step 1: callModel -------------------->\n")
        const assistant = await callModel(messages, tools);

        console.log("Assistant : ", assistant, "\n");

        console.log("step 2: message-push ----------------------->\n")
        messages.push(assistant);

        console.log("step 3: toolcheck ------------------->\n")
        if (!assistant.toolCalls || assistant.toolCalls.length == 0) {
            console.log("\nFinal Answer : ", assistant.content)
            return assistant.content;
        }

        console.log("step 4 : actual tool call --------------------->")
        for (const toolCall of assistant.toolCalls) {
            console.log("\nCalling tool : ", toolCall.name);

            const tool = tools.find(t => t.name === toolCall.name);

            if (!tool) {
                messages.push({ role: "tool", toolCallId: toolCall.id, content: `Tool ${toolCall.name} not found` });
                continue;
            }


            console.log("step 5 : executing tool on local machine ----------------------->")
            const result = await tool.execute(toolCall.arguments);

            console.log("tool result : ", result);

            messages.push({ role: "tool", toolCallId: toolCall.id, content: result });

        }

        console.log("step 7 continue to loop --------------->")
    }
}