export type Message =
    | UserMessage
    | AssistantMessage
    | ToolMessage;

export type UserMessage = {
    role: "user";
    content: string;
};

export type AssistantMessage = {
    role: "assistant";
    content: string;
    toolCalls?: ToolCall[];
};

export type ToolMessage = {
    role: "tool";
    toolCallId: string;
    content: string;
};

export type ToolCall = {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
};

export type Tool = {
    name: string;
    description: string;

    execute(
        args: Record<string, unknown>
    ): Promise<string>;
};