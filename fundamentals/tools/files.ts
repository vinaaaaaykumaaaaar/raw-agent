/**
 * Example tools — read a file, list a directory, do arithmetic. Each is a zod
 * input schema plus a small function; the description carries the weight, since
 * it is the only thing the model reads when deciding whether to use the tool.
 */

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

export interface Tool {
    name: string;
    description: string;
    inputSchema: z.ZodType;
    execute(args: any): string | Promise<string>
}

const listFilesSchema = z.object({
    dir: z.string().optional().describe("Directory path, e.g. 'src' or 'src/tools"),
});

export const listFiles: Tool = {
    name: "list_files",
    description: "List files in a directory (relative to the project root). Defaults to the root.",
    inputSchema: listFilesSchema,
    async execute({ dir = "." }: z.infer<typeof listFilesSchema>) {
        const entries = await readdir(join(process.cwd(), dir), { withFileTypes: true });
        return entries.map((e) => (e.isDirectory() ? e.name + "/" : e.name)).join("\n") || "(empty)";
    },
}

const readFileSchema = z.object({
    path: z.string().describe("File path, e.g. 'src/agent.ts'"),
});

export const readFile: Tool = {
    name: "read_file",
    description: "Read a UTF-8 text file (relative to the project root) and return its contents.",
    inputSchema: readFileSchema,
    async execute({ path }: z.infer<typeof readFileSchema>) {
        const contents = await Bun.file(join(process.cwd(), path)).text();
        return contents.length > 20_000 ? contents.slice(0, 20_000) + "\n...(truncated)" : contents;
    }
};


