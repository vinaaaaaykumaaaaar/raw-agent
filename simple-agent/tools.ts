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
    }
];


