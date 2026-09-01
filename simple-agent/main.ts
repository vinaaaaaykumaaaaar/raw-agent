import { runAgent } from "./agent";
import { tools } from "./tools";

async function main() {
    await runAgent("What is the weather in california?", tools);
}

main().catch(console.error);