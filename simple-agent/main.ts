import { runAgent } from "./agent";
import { tools } from "./tools";

async function main() {
    await runAgent("What is 20 + 30?", tools);
}

main().catch(console.error);