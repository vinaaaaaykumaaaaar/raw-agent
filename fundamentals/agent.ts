/**
 * The agent loop: an LLM call inside a while-loop with tools. Each turn calls the
 * model with the full conversation plus the tool list; if the reply has no tool
 * calls the model is done, otherwise we run the tools, append the results, and
 * loop. The model is stateless — the growing `messages` array is the entire
 * memory — and the model itself decides when to stop. `maxTurns` is a safety rail.
 */

import OpenAI from "openai";
import { z } from "zod";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export const DEFAULT_MODEL = process.env.MODEL ?? "gpt-5-mini";

export type AgentEvent =
    | { type: "turn"; agent: string; n: number }
    | { type: "text"; agent: string; text: string }
    | { type: "tool_call"; agent: string; name: string; args: string }
    | { type: "tool_result"; agent: string; name: string; result: string };

export interface AgentOptions {
    name?: string;
    model?: string;
    systemPrompt: string;
    maxTurns?: number;
    responseSchema?: z.ZodType;
    onEvent?: (e: AgentEvent) => void;
}

const response = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: "system", content: "you are an very helpful assistant" }, { role: "user", content: "yeah how are you doing ?" }]
});

