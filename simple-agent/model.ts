import type {
    AssistantMessage,
    Message,
    Tool
} from "./types";

export async function callModel(
    messages: Message[],
    tools: Tool[]): Promise<AssistantMessage> {

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "user") {
        return {
            role: "assistant",
            content: "I will use the calculator tool.",
            toolCalls: [
                {
                    id: "call_1",
                    name: "calculator",
                    arguments: {
                        a: 20,
                        b: 30
                    }
                }
            ]
        };
    }

    // After tool execution
    if (lastMessage?.role === "tool") {

        return {
            role: "assistant",
            content:
                `The result is ${lastMessage?.content}`
        };
    }

    throw new Error(
        "Unexpected conversation state"
    );

}