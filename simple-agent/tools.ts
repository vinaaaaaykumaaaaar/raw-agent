import type { Tool } from "./types";

export const tools: Tool[] = [
    {
        name: "calculator",

        description:
            "Add two numbers",

        execute: async (args) => {
            const a = Number(args.a);
            const b = Number(args.b);

            return String(a + b);
        }
    },
    {
        name: "weather",

        description:
            "returns the weather of the give city or place",

        execute: async (args) => {
            const a = args.a;

            return "weather is 10*C";
        }
    }
];


